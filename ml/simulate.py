"""Synthetic UPI transaction simulator for Saathi.

ALL DATA IS SYNTHETIC. No real people, accounts, or transactions are used.
Scam shapes are assumptions based on public descriptions of each scam type.
"""
import math
from statistics import median

import numpy as np
import pandas as pd

FEATURES = [
    "log_amount_ratio", "new_payee", "log_prior_payments", "step_up",
    "consecutive_increases", "log_cumulative_ratio", "young_payee",
    "unknown_call", "payee_reports", "night", "balance_fraction",
]
SCAM_TYPES = ["investment", "digital_arrest", "fake_kyc", "emergency"]


def featurize(c):
    """Turn one payment context into model features. Mirrored in web/public/score.js."""
    prior = c["prior_n"]
    return {
        "log_amount_ratio": math.log((c["amount"] + 1) / (c["median"] + 1)),
        "new_payee": float(prior == 0),
        "log_prior_payments": math.log1p(prior),
        "step_up": math.log(c["amount"] / c["last_amt"]) if prior and c["last_amt"] > 0 else 0.0,
        "consecutive_increases": float(min(c["consec"], 5)),
        "log_cumulative_ratio": math.log((c["cum14"] + c["amount"] + 1) / (c["median"] + 1)),
        "young_payee": float(c["age"] <= 30),
        "unknown_call": float(c["call"]),
        "payee_reports": float(min(c["reports"], 2)),
        "night": float(c["hour"] >= 22 or c["hour"] < 6),
        "balance_fraction": min(1.0, c["amount"] / max(c["balance"], 1)),
    }


def rules_score(c):
    """Transparent baseline: points for each scam signal; pause at 50 or more."""
    points = 0
    points += 20 if c["prior_n"] == 0 else 0
    points += 25 if c["amount"] >= 3 * c["median"] else 0
    points += 35 if c["consec"] >= 2 else 0
    points += 25 if c["call"] else 0
    points += 40 if c["reports"] >= 1 else 0
    return points


def _event(day, payee, amount, label, kind, rng, call_p=0.04, report_p=0.003):
    return {
        "day": float(day) + float(rng.random()) * 0.99,
        "payee": payee, "amount": max(10.0, round(float(amount))), "label": label, "kind": kind,
        "call": int(rng.random() < call_p), "reports": int(rng.random() < report_p) * int(rng.integers(1, 3)),
    }


def _legit_unusual(rng, sid, base, days):
    events, kind = [], rng.choice(["medical", "gift", "repair", "new_investment", "insurance"])
    start, payee = int(rng.integers(35, days - 5)), f"s{sid}_legit_{rng.integers(1_000_000)}"
    if kind == "medical":
        events.append(_event(start, payee, base * rng.uniform(5, 45), 0, kind, rng, call_p=0.35))
    elif kind == "gift":
        events.append(_event(start, payee, base * rng.uniform(4, 30), 0, kind, rng, call_p=0.08))
    elif kind == "insurance":
        events.append(_event(start, payee, base * rng.uniform(5, 25), 0, kind, rng, call_p=0.2))
    elif kind == "repair":  # Hard negative: escalating payments to a new payee.
        amount = base * rng.uniform(2, 6)
        for i in range(int(rng.integers(2, 5))):
            events.append(_event(min(start + i * 3, days - 1), payee, amount, 0, kind, rng, call_p=0.1))
            amount *= rng.uniform(1.1, 2.2)
    else:  # Hard negative: a genuine new investment that is topped up.
        amount = base * rng.uniform(3, 10)
        for i in range(int(rng.integers(2, 6))):
            events.append(_event(min(start + i * 7, days - 1), payee, amount, 0, kind, rng, call_p=0.08))
            amount *= rng.uniform(1.0, 1.8)
    return events


def _scam(rng, sid, days):
    kind, events = rng.choice(SCAM_TYPES, p=[0.5, 0.15, 0.2, 0.15]), []
    start, payee = int(rng.integers(45, days - 25)), f"s{sid}_scam_{rng.integers(1_000_000)}"
    if kind == "investment":
        amount, day = rng.uniform(2_000, 10_000), start
        reported = 1 if rng.random() < 0.15 else 0
        for _ in range(int(rng.integers(4, 10))):
            if rng.random() < 0.25:
                payee, reported = f"s{sid}_scam_{rng.integers(1_000_000)}", int(rng.random() < 0.15)
            event = _event(min(day, days - 1), payee, amount, 1, kind, rng, call_p=0.1, report_p=0)
            event["reports"] = reported
            events.append(event)
            amount *= rng.uniform(1.15, 2.4)
            day += int(rng.integers(1, 7))
    else:
        settings = {
            "digital_arrest": ((1, 4), (25_000, 300_000), 0.9, 0.25),
            "fake_kyc": ((1, 3), (1_000, 25_000), 0.7, 0.35),
            "emergency": ((1, 3), (5_000, 60_000), 0.5, 0.15),
        }[kind]
        count, (low, high), call_p, report_p = settings
        reported = int(rng.random() < report_p)
        for i in range(int(rng.integers(*count))):
            event = _event(min(start + (i // 2), days - 1), payee,
                           math.exp(rng.uniform(math.log(low), math.log(high))), 1, kind, rng,
                           call_p=call_p, report_p=0)
            event["reports"] = reported
            events.append(event)
    return events


def simulate_senior(rng, sid, days=180, scam_rate=0.18):
    base = float(rng.lognormal(math.log(700), 0.6))
    balance = float(rng.lognormal(math.log(400_000), 0.8))
    payees = [(f"s{sid}_regular_{i}", base * float(rng.lognormal(0, 0.6)))
              for i in range(int(rng.integers(8, 21)))]
    events = []
    for day in range(days):
        for _ in range(int(rng.poisson(0.8))):
            if rng.random() < 0.07:
                events.append(_event(day, f"s{sid}_shop_{rng.integers(1_000_000)}",
                                     base * rng.lognormal(0, 0.8), 0, "new_small", rng))
            else:
                payee, typical = payees[int(rng.integers(len(payees)))]
                events.append(_event(day, payee, typical * rng.lognormal(0, 0.35), 0, "routine", rng))
    for _ in range(int(rng.poisson(1.5))):
        events.extend(_legit_unusual(rng, sid, base, days))
    if rng.random() < scam_rate:
        events.extend(_scam(rng, sid, days))
    events.sort(key=lambda e: e["day"])

    rows, history, per_payee = [], [], {}
    for event in events:
        day, payee, amount = event["day"], event["payee"], event["amount"]
        recent = [a for d, a in history if day - d <= 90]
        past = per_payee.get(payee, [])
        consec = 0
        sequence = [a for _, a in past] + [amount]
        for i in range(len(sequence) - 1, 0, -1):
            if sequence[i] > sequence[i - 1]:
                consec += 1
            else:
                break
        hour_probs = np.array([.002] * 6 + [.05, .08, .1, .1, .1, .09, .08, .07, .07, .07, .06, .05, .03, .02, .01, .008, .004, .004])
        context = {
            "amount": amount, "median": median(recent) if recent else base,
            "prior_n": len(past), "last_amt": past[-1][1] if past else 0.0, "consec": consec,
            "cum14": sum(a for d, a in past if day - d <= 14),
            "age": day - past[0][0] if past else 0.0, "call": event["call"], "reports": event["reports"],
            "hour": int(rng.choice(24, p=hour_probs / hour_probs.sum())),
            "balance": balance,
        }
        if day >= 30:  # 30-day burn-in so that each senior has a baseline.
            rows.append({"senior": sid, "day": round(day, 2), "kind": event["kind"], "label": event["label"],
                         "rules_score": rules_score(context), **context, **featurize(context)})
        history.append((day, amount))
        per_payee.setdefault(payee, []).append((day, amount))
        balance = max(1_000.0, balance - amount)
    return rows


def simulate(n_seniors=800, seed=42):
    rng = np.random.default_rng(seed)
    rows = []
    for sid in range(n_seniors):
        rows.extend(simulate_senior(rng, sid))
    return pd.DataFrame(rows)
