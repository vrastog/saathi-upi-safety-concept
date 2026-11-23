# User Flows

## A. Setup and opt-in
```mermaid
flowchart LR
  A[Senior sees invitation] --> B{Opt in?}
  B -- No --> C[Nothing changes]
  B -- Yes --> D[Choose one trusted contact]
  D --> E[Review exactly what is shared]
  E --> F[Contact gets invitation]
  F --> G{Contact accepts?}
  G -- No --> D
  G -- Yes --> H[Saathi active]
```

## B. Normal payment
```mermaid
flowchart LR
  A[Senior starts payment] --> B[Risk score below threshold]
  B --> C[Payment continues]
  C --> D[No one is notified]
```

## C. Risky payment
```mermaid
flowchart TD
  A[Senior starts payment] --> B[Risk score above threshold]
  B --> C[Pause with Hindi and English explanation]
  B --> D[Trusted contact alerted]
  D --> E[Contact calls or sends a note]
  E --> C
  C --> F{Senior decides}
  F -- Stop --> G[Money does not move, 1930 help shown]
  F -- Continue after 10 seconds --> H[Payment proceeds]
  G --> I[Contact sees outcome]
  H --> I
```

## D. Trusted contact
```mermaid
flowchart LR
  A[Accept invitation] --> B[No routine activity visible]
  B --> C[Risk alert arrives]
  C --> D[One-tap call]
  D --> E[Send stop or OK note]
  E --> F[See outcome]
```

Wireframes are the working screens in the prototype's **Live demo** and **Setup and privacy** tabs.
