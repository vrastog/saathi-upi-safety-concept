"""Train and evaluate Saathi's risk model on synthetic data. Run: python ml/train.py"""
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from simulate import FEATURES, SCAM_TYPES, featurize, rules_score, simulate

ROOT = Path(__file__).resolve().parent.parent
TARGET_FPR = 0.01


def threshold_for_fpr(y, scores, target=TARGET_FPR):
    return float(np.quantile(scores[y == 0], 1 - target))


def metrics(y, flagged, amounts):
    y, flagged = np.asarray(y).astype(int), np.asarray(flagged).astype(bool)
    tp, fp = int((flagged & (y == 1)).sum()), int((flagged & (y == 0)).sum())
    fn, tn = int((~flagged & (y == 1)).sum()), int((~flagged & (y == 0)).sum())
    return {
        "precision": tp / (tp + fp) if tp + fp else 0.0,
        "recall": tp / (tp + fn) if tp + fn else 0.0,
        "false_positive_rate": fp / (fp + tn) if fp + tn else 0.0,
        "rupee_recall": float(np.asarray(amounts)[flagged & (y == 1)].sum() / np.asarray(amounts)[y == 1].sum()),
        "tp": tp, "fp": fp, "fn": fn, "tn": tn,
    }


def precision_at_prevalence(recall, fpr, prevalence):
    denominator = recall * prevalence + fpr * (1 - prevalence)
    return recall * prevalence / denominator if denominator else 0.0


def logistic():
    return make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000, class_weight="balanced"))


def main():
    df = simulate()
    seniors = np.random.default_rng(7).permutation(df["senior"].unique())
    n = len(seniors)
    train_ids, val_ids, test_ids = seniors[:int(.6 * n)], seniors[int(.6 * n):int(.8 * n)], seniors[int(.8 * n):]
    train, val, test = (df[df.senior.isin(ids)] for ids in (train_ids, val_ids, test_ids))

    lr = logistic().fit(train[FEATURES], train.label)
    gbm = HistGradientBoostingClassifier(max_depth=4, max_iter=150, learning_rate=0.08, class_weight="balanced",
                                         random_state=42).fit(train[FEATURES], train.label)
    lr_threshold = threshold_for_fpr(val.label.values, lr.predict_proba(val[FEATURES])[:, 1])
    gbm_threshold = threshold_for_fpr(val.label.values, gbm.predict_proba(val[FEATURES])[:, 1])
    lr_test, gbm_test = lr.predict_proba(test[FEATURES])[:, 1], gbm.predict_proba(test[FEATURES])[:, 1]

    results = {
        "rules_baseline": metrics(test.label, test.rules_score >= 50, test.amount),
        "logistic_regression": {**metrics(test.label, lr_test >= lr_threshold, test.amount),
                                "roc_auc": roc_auc_score(test.label, lr_test),
                                "pr_auc": average_precision_score(test.label, lr_test)},
        "gradient_boosting": {**metrics(test.label, gbm_test >= gbm_threshold, test.amount),
                              "roc_auc": roc_auc_score(test.label, gbm_test),
                              "pr_auc": average_precision_score(test.label, gbm_test)},
    }

    # Unseen scam type: retrain with one type removed, then test on that type.
    unseen = {}
    for scam in SCAM_TYPES:
        fit = train[train.kind != scam]
        calibrate = val[val.kind != scam]
        model = logistic().fit(fit[FEATURES], fit.label)
        cut = threshold_for_fpr(calibrate.label.values, model.predict_proba(calibrate[FEATURES])[:, 1])
        held = test[test.kind == scam]
        unseen[scam] = {"n": int(len(held)), "recall": float((model.predict_proba(held[FEATURES])[:, 1] >= cut).mean())}

    # Hand-written scenarios: never used for training or threshold selection.
    cases = pd.read_csv(ROOT / "ml" / "labelled_scenarios.csv")
    contexts = cases.to_dict("records")
    case_x = pd.DataFrame([featurize(c) for c in contexts])[FEATURES]
    case_scores = lr.predict_proba(case_x)[:, 1]
    case_rules = np.array([rules_score(c) >= 50 for c in contexts])
    case_flags = case_scores >= lr_threshold
    scenario = {
        "n": int(len(cases)), "model": metrics(cases.label, case_flags, cases.amount),
        "rules_baseline": metrics(cases.label, case_rules, cases.amount),
        "misses": cases.loc[(cases.label == 1) & ~case_flags, ["id", "note"]].to_dict("records"),
        "false_alarms": cases.loc[(cases.label == 0) & case_flags, ["id", "note"]].to_dict("records"),
    }

    chosen = results["logistic_regression"]
    report = {
        "synthetic_data_notice": "All metrics are measured on simulated data and do not estimate real-world performance.",
        "dataset": {"seniors": int(df.senior.nunique()), "transactions": int(len(df)), "scam_transactions": int(df.label.sum()),
                    "simulated_scam_share": float(df.label.mean()), "train_seniors": len(train_ids),
                    "validation_seniors": len(val_ids), "test_seniors": len(test_ids)},
        "target_false_positive_rate": TARGET_FPR, "test": results, "unseen_scam_type_recall": unseen,
        "handwritten_scenarios": scenario,
        "precision_if_real_prevalence_were": {
            str(p): precision_at_prevalence(chosen["recall"], chosen["false_positive_rate"], p) for p in (0.01, 0.001, 0.0001)},
    }
    scaler, clf = lr.named_steps["standardscaler"], lr.named_steps["logisticregression"]
    model = {"features": FEATURES, "mean": scaler.mean_.tolist(), "scale": scaler.scale_.tolist(),
             "coef": clf.coef_[0].tolist(), "intercept": float(clf.intercept_[0]), "threshold": lr_threshold}

    public = ROOT / "web" / "public"
    public.mkdir(parents=True, exist_ok=True)
    (public / "model.json").write_text(json.dumps(model, indent=1))
    (public / "metrics.json").write_text(json.dumps(report, indent=1))
    (ROOT / "data").mkdir(exist_ok=True)
    sample = pd.concat([df[df.label == 1].sample(100, random_state=1), df[df.label == 0].sample(400, random_state=1)])
    sample.sort_values(["senior", "day"]).drop(columns=FEATURES).to_csv(ROOT / "data" / "SYNTHETIC_sample_transactions.csv", index=False)
    parity = pd.DataFrame({"score": case_scores})
    parity.to_json(ROOT / "ml" / "parity_scores.json", orient="records")
    print(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
