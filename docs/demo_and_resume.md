# Demo Script and Resume Bullets

## 75-second demo script

| Time | Show | Say |
|---|---|---|
| 0:00 | Title and notice | "Investment scams made up about 77% of India's reported cyber-fraud losses in 2025. The hard part is that victims usually don't know they're being scammed." |
| 0:12 | Google Pay Home, point to Saathi card | "Saathi is my concept for a feature inside Google Pay, so it lives right here on Home. A senior opts in and picks one trusted person. This is an unofficial mock-up, and everything is simulated." |
| 0:20 | Normal payment, press Pay | "A normal payment changes nothing, and nobody is notified. That protects privacy and dignity." |
| 0:28 | Investment scam, press Pay | "This fourth, growing deposit triggers a pause in Hindi and English. At the same moment, the daughter gets an alert." |
| 0:40 | Call, send stop note, stop payment | "She can call and advise, but she can't block the payment. The senior stays in control, which also limits misuse by a controlling relative." |
| 0:50 | Hospital scenario | "Here's a false alarm: a real hospital bill. The senior can continue, so the family loop absorbs the model's mistake." |
| 0:58 | Evaluation tab | "I compared a trained model with a rules baseline on synthetic data. It did better on the test set, but raised more false alarms on my hard cases and struggled with scam types it hadn't seen." |
| 1:10 | Close | "So the next step isn't a fancier model. It's testing with real families and real, consented data." |

## Resume bullets

Use these only after the live link or repository is up.

- Conceived and prototyped Saathi, a trusted-contact fraud safeguard for seniors using UPI, with a side-by-side senior and family demo and privacy-first opt-in design.
- Trained a logistic-regression risk model on 99K synthetic transactions, reaching 89% recall at a 1% false-positive rate versus 65% recall at 2.9% for a rules baseline on held-out simulated users.
- Stress-tested the model on 48 hand-written cases and unseen scam types, exposing a 37.5% false-alarm rate and 31% recall on held-out investment scams, and used those limits to define the validation roadmap.

Say "synthetic" whenever you quote these numbers. If Gemini is connected and tested, you can add: "Integrated Gemini to generate Hindi and English safety explanations, with a template fallback."
