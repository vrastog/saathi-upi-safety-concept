# Saathi: One-Page Product Concept

*Independent student concept for a feature inside Google Pay or another UPI app. Not affiliated with Google or NPCI. "Saathi" is a working title.*

**Problem.** Investment scams made up about 77% of India's reported 2025 cyber-fraud losses, and digital arrest scams about 8% ([Lokmat Times](https://www.lokmattimes.com/technology/indians-lose-over-rs-52976-crore-to-cyber-frauds-over-six-years-report-1/amp)). Reported totals vary by source.

**Insight.** People being scammed usually do not realise it, so tools they must choose to open fail at the critical moment. Protection has to appear when money is about to leave, and it helps to bring in someone the victim trusts.

**Users.** Primary: a senior (60+) who uses UPI, has savings, and lives apart from their children. Secondary: an adult child or other trusted contact.

**Solution.** A senior opts in and nominates one trusted contact. Normal payments do not change and stay private. When a payment matches a scam pattern:
1. The senior sees a short pause with a plain Hindi and English explanation.
2. The trusted contact gets an alert with a one-tap call.
3. The senior can still proceed. The contact can advise, but cannot approve or block.

**Why now.** RBI's April 2026 discussion paper proposed protections for older customers, including a trusted-person approval. Later reporting says this became voluntary and **will not apply to UPI** ([Deccan Chronicle](https://www.deccanchronicle.com/nation/rbi-proposes-trusted-person-approval-for-online-fund-transfers-2007229), [Business Standard](https://www.business-standard.com/finance/personal-finance/one-hour-delay-to-upi-friction-rbi-proposals-to-fight-online-fraud-126041000580_1.html)). *Confirm against the RBI text before quoting.*

**Competitive gap**

| Existing option | What it does | Gap |
|---|---|---|
| [Google Scam Detection](https://techcrunch.com/2025/11/20/google-steps-up-ai-scam-protection-in-india-but-gaps-remain) | On-device call scanning, Pixel 9+ in India, off by default | Limited devices, and slow-burn scams may involve no suspicious call |
| Google screen-share alert | Warns during risky screen sharing, piloted with Google Pay, Paytm, and Navi | Investment scams often involve no screen sharing |
| [Truecaller Family Protection](https://techcrunch.com/2026/03/12/truecallers-now-lets-you-hang-up-on-scammers-on-behalf-of-your-family/) | Family admin gets scam-call alerts and can end calls on Android | Acts on calls, not at the moment of payment |
| [UPI Circle](https://www.npci.org.in/PDF/npci/press-releases/2024/NPCI-Press-Release-RBI-Governor-Launches-Key-Digital-Payment-Initiatives-at-Global-Fintech-Festival-2024.pdf) | Lets a secondary user pay from a primary user's account | Does not guard the senior's own savings account |

A web search found no UPI app that alerts a trusted contact about a senior's own risky payment. **This still needs a hands-on check in each app.**

**Metrics (proposed, not measured)**
- North Star: rupees of fraud prevented per 1,000 protected seniors.
- Guardrails: legitimate payments paused, median delay, senior opt-out rate, contact response time.
- Adoption: invited seniors who opt in, setup completion.

**Risks and proposed defaults**

| Risk | Default in this concept |
|---|---|
| False alarms | Pause is short and the senior can always continue |
| Controlling family member | Contact cannot block, senior sees every alert, can remove contact anytime |
| Contact does not respond | Senior still sees the pause, and the flow never waits on the contact |
| No trusted contact | Open question: pause only, or an opt-in helpline |
| Consent and privacy | Two-sided opt-in, risk events only, no balance or everyday history shared |
| Regulation | Needs review under NPCI rules, RBI guidance, and India's DPDP Act |

**Open questions for the PM.** Final name, false-alarm tolerance, the no-contact path, and how to validate with real seniors.
