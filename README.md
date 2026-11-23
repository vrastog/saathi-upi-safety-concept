# Saathi: A Trusted-Family Safety Loop for Seniors on UPI

> **Independent student concept.** Not affiliated with or endorsed by Google, NPCI, or any bank. All people, transactions, and metrics are **synthetic**. No user research has been conducted yet. "Saathi" is a working title.

## Problem
Investment scams were about 77% of India's reported 2025 cyber-fraud losses, and digital arrest scams about 8% ([source](https://www.lokmattimes.com/technology/indians-lose-over-rs-52976-crore-to-cyber-frauds-over-six-years-report-1/amp)).

## Insight
People being scammed usually do not realise it, so a tool they must choose to open fails when it matters. Saathi acts when money is about to leave and brings in someone the senior trusts.

## Competitive analysis
Call-scanning, screen-share alerts, Truecaller Family Protection, and UPI Circle each cover part of the problem. None that we found alerts a trusted contact at the moment of a risky payment from a senior's own account. RBI's proposed trusted-person safeguard reportedly excludes UPI. See the [full concept](docs/concept.md).

## Solution
- Normal payments do not change, and nobody is notified.
- Risky payments trigger a short Hindi and English pause, plus an alert to one trusted contact.
- The senior always decides. The contact can call and advise, but cannot approve or block.

See the [user flows](docs/user_flows.md).

## Success metrics (proposed)
**North Star:** rupees of fraud prevented per 1,000 protected seniors. **Guardrails:** legitimate payments paused, added delay, opt-out rate, contact response time.

## Prototype
- **Risk model:** logistic regression with 11 behavioural features, exported to JSON and run in the browser.
- **Generative AI:** a server-side Gemini route writes the safety messages. It receives only the amount, risk-signal codes, and a family label. If Gemini is unavailable, written templates are used.
- **Demo:** a high-fidelity Google Pay concept mock-up with Saathi embedded on Home and in the payment flow. Guided tap prompts walk through the senior and trusted-contact phones across five simulated scenarios. It moves no money and never asks for a PIN.
- **Branding note:** Google and Google Pay names and logos belong to Google and are used only to illustrate this unofficial product concept.

```bash
python3 -m venv .venv && .venv/bin/pip install scikit-learn numpy pandas
```
```bash
.venv/bin/python ml/train.py
```
```bash
GEMINI_API_KEY=your_key node server.js
```

The app also runs without a key, using the templates.

## Evaluation
Data: 800 synthetic seniors, 99,173 payments, 517 scam payments. Users were split 60/20/20, and the threshold was set on validation users for about a 1% false-positive rate.

| Held-out simulated test set | Precision | Recall | False-positive rate |
|---|---:|---:|---:|
| Rules baseline | 8.7% | 65.5% | 2.9% |
| **Logistic regression (used)** | **27.3%** | **89.3%** | **1.0%** |
| Gradient boosting | 26.2% | 85.7% | 1.0% |

| 48 hand-written hard cases | Precision | Recall | False-positive rate |
|---|---:|---:|---:|
| Rules baseline | 76.2% | 66.7% | 20.8% |
| Logistic regression | 67.9% | 79.2% | 37.5% |

Logistic regression was kept because it performed similarly at the 1% false-positive operating point and is easier to explain. Gradient boosting had the better overall ranking (PR-AUC 0.72 versus 0.60), so it remains worth revisiting with real data.

## Limitations
- **The test set shares the simulator's assumptions**, so its results are likely optimistic and do not predict real-world performance.
- **False alarms are a real weakness.** On hard cases the model flagged hospital bills, gifts, and renovation payments more often than the rules did.
- **Novel scams are harder.** With investment scams removed from training, recall on them fell to 31.5%.
- **Precision depends on prevalence.** If 0.1% of real payments were scams, the same model's precision would be about 8%.
- **Small samples.** The test set has 84 scam payments and the hard-case set has 48 cases.
- **Some signals may be hard to get in production**, such as call overlap, which needs device permissions and consent.

## Next steps
1. Interview seniors and adult children to test trust, dignity, and alert fatigue.
2. Check Google Pay, PhonePe, and Paytm hands-on for overlapping features.
3. Validate on consented or partner data, then improve false alarms.
4. Review the design against RBI, NPCI, and DPDP requirements.

Demo script and resume bullets are in [docs/demo_and_resume.md](docs/demo_and_resume.md).
