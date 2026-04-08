# ForexBack — Back Office Portal

A modern, frontend-only dashboard for back office staff at a forex brokerage. No backend, no build tools, no dependencies — open `index.html` in any browser and it works.

## Project structure

```
practice/
├── index.html              # Main entry point — all screens in one file
├── assets/
│   ├── css/
│   │   └── styles.css      # All styles (variables, auth, dashboard, widgets)
│   └── js/
│       └── app.js          # All interactivity (auth flow, routing, nav)
└── README.md
```

## Screens

| Screen    | Trigger                          |
|-----------|----------------------------------|
| Login     | Default on load                  |
| Sign Up   | "Sign Up" link on login page     |
| Dashboard | Any valid (non-empty) credentials |

## Dashboard sections

**Sidebar navigation**
- Main: Overview, Withdrawals, Deposits, Internal Transfers
- Compliance: KYC / AML Review, Documents, Suspicious Activity
- Accounts: Client Accounts, Account Balances, Transaction History
- Reports: Daily Reports, Export Data
- System: Settings

**Stat cards**
- Pending Withdrawals — count + total value
- KYC Pending — count + daily delta
- Deposits Today — volume + % change
- SAR Alerts — count requiring immediate review

**Widgets**
- Pending Withdrawal Requests — sortable table with status pills
- KYC / AML Review Queue — client list with document type and review link
- Recent Activity — colour-coded audit feed
- Quick Actions — six one-click shortcuts (Approve, Verify KYC, Upload Doc, File SAR, Message Client, Export)

## How to run

No build step required. Just open the file:

```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

Or serve it locally:

```bash
npx serve .
# then visit http://localhost:3000
```

## Tech

- Pure HTML5, CSS3, vanilla JavaScript (ES5-compatible)
- CSS custom properties for the full design system (colours, spacing, shadows)
- Inline SVG icons — no icon font dependency
- Simulated auth: any non-empty email + password logs in
