# KiranaMitra — GitHub Project Setup Guide

This document contains everything needed to set up the GitHub project with waterfall methodology, labels, milestones, and issues.

---

## 1. Repository Settings

Go to **Settings** → **General**:
- **Description:** `Free, offline-first POS & inventory app for Indian kirana (grocery) stores`
- **Website:** `https://www.hardikkanajariya.in`
- **Topics:** `react-native`, `pos`, `kirana`, `inventory`, `offline-first`, `watermelondb`, `typescript`, `india`, `billing`, `android`
- **Features:** ✅ Issues, ✅ Projects, ❌ Wiki (optional), ✅ Discussions (optional)

---

## 2. Labels

Create these labels in **Issues → Labels → New label**:

| Label | Color | Description |
|---|---|---|
| `phase-1-foundation` | `#0E8A16` | Phase 1: Core Foundation |
| `phase-2-features` | `#1D76DB` | Phase 2: Core Features |
| `phase-3-advanced` | `#5319E7` | Phase 3: Advanced Features |
| `phase-4-polish` | `#FBCA04` | Phase 4: Cloud & Polish |
| `phase-5-future` | `#D93F0B` | Phase 5: Future Enhancements |
| `feature` | `#A2EEEF` | New feature or request |
| `enhancement` | `#84B6EB` | Improvement to existing feature |
| `documentation` | `#0075CA` | Documentation improvements |
| `ui/ux` | `#E99695` | User interface / experience |
| `database` | `#BFD4F2` | Database / data layer |
| `i18n` | `#C5DEF5` | Internationalization |
| `ci/cd` | `#F9D0C4` | Build / deployment pipeline |
| `printing` | `#D4C5F9` | Thermal printing related |
| `billing` | `#BFDADC` | Billing / POS related |
| `customers` | `#FEF2C0` | Customer management |
| `reports` | `#C2E0C6` | Reports & analytics |
| `sync` | `#B4A7D6` | Cloud sync / backup |
| `priority-high` | `#B60205` | High priority |
| `priority-medium` | `#E99695` | Medium priority |
| `priority-low` | `#C2E0C6` | Low priority |
| `status-done` | `#0E8A16` | Completed |
| `status-in-progress` | `#FBCA04` | Currently being worked on |

---

## 3. Milestones

Create these milestones in **Issues → Milestones → New milestone**:

### Milestone 1: Core Foundation
- **Title:** `Phase 1 — Core Foundation`
- **Due date:** _(completed)_
- **Description:** Project setup, database schema, navigation, theming, and internationalization infrastructure.

### Milestone 2: Core Features
- **Title:** `Phase 2 — Core Features`
- **Due date:** _(completed)_
- **Description:** Product management, billing/POS, customer CRUD, credit system, and dashboard.

### Milestone 3: Advanced Features
- **Title:** `Phase 3 — Advanced Features`
- **Due date:** _(completed)_
- **Description:** Bluetooth printing, PDF receipts, reports, inventory tracking, advance payments.

### Milestone 4: Cloud & Polish
- **Title:** `Phase 4 — Cloud & Polish`
- **Due date:** _(completed)_
- **Description:** Google Drive sync, auto-backup, app icons, UI/UX polish, CI/CD pipeline.

### Milestone 5: Future Enhancements
- **Title:** `Phase 5 — Future Enhancements`
- **Due date:** `2026-06-30`
- **Description:** Barcode scanner, product images, Excel export, WhatsApp sharing, multi-store support.

---

## 4. Issues — Waterfall Project Tracker

### Phase 1 — Core Foundation ✅ (All Closed)

| # | Title | Labels | Status |
|---|---|---|---|
| 1 | Set up React Native 0.83 project with TypeScript | `phase-1-foundation`, `feature` | ✅ Closed |
| 2 | Configure WatermelonDB schema and models | `phase-1-foundation`, `database` | ✅ Closed |
| 3 | Set up React Navigation 7 (stacks + bottom tabs) | `phase-1-foundation`, `feature` | ✅ Closed |
| 4 | Implement MD3 theme system (light/dark) | `phase-1-foundation`, `ui/ux` | ✅ Closed |
| 5 | Set up i18next with EN/HI/GU translations | `phase-1-foundation`, `i18n` | ✅ Closed |
| 6 | Configure path aliases and module resolution | `phase-1-foundation`, `feature` | ✅ Closed |
| 7 | Set up Zustand + MMKV state management | `phase-1-foundation`, `feature` | ✅ Closed |
| 8 | Create shared component library | `phase-1-foundation`, `ui/ux` | ✅ Closed |

### Phase 2 — Core Features ✅ (All Closed)

| # | Title | Labels | Status |
|---|---|---|---|
| 9 | Product CRUD with categories | `phase-2-features`, `feature` | ✅ Closed |
| 10 | Product search and filtering | `phase-2-features`, `feature` | ✅ Closed |
| 11 | Billing / POS screen with cart | `phase-2-features`, `billing` | ✅ Closed |
| 12 | Multiple payment modes (Cash, UPI, Credit) | `phase-2-features`, `billing` | ✅ Closed |
| 13 | Customer management (CRUD + phone search) | `phase-2-features`, `customers` | ✅ Closed |
| 14 | Credit (udhar) system with ledger | `phase-2-features`, `customers` | ✅ Closed |
| 15 | Dashboard with today's sales & stats | `phase-2-features`, `feature` | ✅ Closed |
| 16 | Category management screen | `phase-2-features`, `feature` | ✅ Closed |

### Phase 3 — Advanced Features ✅ (All Closed)

| # | Title | Labels | Status |
|---|---|---|---|
| 17 | Bluetooth thermal printer integration (ESC/POS) | `phase-3-advanced`, `printing` | ✅ Closed |
| 18 | PDF receipt generation and sharing | `phase-3-advanced`, `billing` | ✅ Closed |
| 19 | Sales reports with date range filter | `phase-3-advanced`, `reports` | ✅ Closed |
| 20 | Credit reports (outstanding balances) | `phase-3-advanced`, `reports` | ✅ Closed |
| 21 | Inventory stock-in / stock-out tracking | `phase-3-advanced`, `feature` | ✅ Closed |
| 22 | Advance payment / customer wallet system | `phase-3-advanced`, `customers` | ✅ Closed |
| 23 | Bill history and reprint | `phase-3-advanced`, `billing` | ✅ Closed |
| 24 | Product stock alerts (low stock warning) | `phase-3-advanced`, `feature` | ✅ Closed |

### Phase 4 — Cloud & Polish ✅ (All Closed)

| # | Title | Labels | Status |
|---|---|---|---|
| 25 | Google Drive backup & restore | `phase-4-polish`, `sync` | ✅ Closed |
| 26 | Auto-sync on data changes | `phase-4-polish`, `sync` | ✅ Closed |
| 27 | App icon generation (Android + iOS) | `phase-4-polish`, `ui/ux` | ✅ Closed |
| 28 | UI/UX polish pass (all screens) | `phase-4-polish`, `ui/ux` | ✅ Closed |
| 29 | GitHub Actions CI/CD for release APK | `phase-4-polish`, `ci/cd` | ✅ Closed |
| 30 | Complete i18n coverage (HI/GU for all screens) | `phase-4-polish`, `i18n` | ✅ Closed |
| 31 | LICENSE and CREDITS files | `phase-4-polish`, `documentation` | ✅ Closed |
| 32 | Comprehensive README documentation | `phase-4-polish`, `documentation` | ✅ Closed |

### Phase 5 — Future Enhancements 🚧 (Open)

| # | Title | Labels | Priority | Status |
|---|---|---|---|---|
| 33 | Barcode scanner integration | `phase-5-future`, `feature` | 🔴 High | 🟡 Open |
| 34 | Product image support (camera + gallery) | `phase-5-future`, `feature` | 🔴 High | 🟡 Open |
| 35 | Export reports to Excel (XLSX) | `phase-5-future`, `reports` | 🟠 Medium | 🟡 Open |
| 36 | WhatsApp bill sharing | `phase-5-future`, `billing` | 🟠 Medium | 🟡 Open |
| 37 | Multi-store support | `phase-5-future`, `feature` | 🔴 High | 🟡 Open |
| 38 | Customer SMS/WhatsApp payment reminders | `phase-5-future`, `customers` | 🟠 Medium | 🟡 Open |
| 39 | Expense tracking module | `phase-5-future`, `feature` | 🟢 Low | 🟡 Open |
| 40 | Daily profit/loss report | `phase-5-future`, `reports` | 🟠 Medium | 🟡 Open |
| 41 | Bulk product import from CSV/Excel | `phase-5-future`, `feature` | 🟢 Low | 🟡 Open |
| 42 | Voice search for products (Hindi/Gujarati) | `phase-5-future`, `feature` | 🟢 Low | 🟡 Open |

---

## 5. GitHub Project Board

Create a **Project** in **Projects → New project → Table view**:

**Name:** `KiranaMitra Development`
**Description:** `Waterfall project tracker for KiranaMitra POS app`

### Views to create:

#### 1. Table View (Default)
Columns: `Title`, `Status`, `Phase`, `Priority`, `Labels`, `Assignee`

Group by: **Phase** (milestone)

#### 2. Board View
Columns: `Backlog` → `To Do` → `In Progress` → `Done`

#### 3. Roadmap View (Timeline)
Group by milestone, show dates

### Custom Fields:
| Field | Type | Options |
|---|---|---|
| Phase | Single select | Phase 1, Phase 2, Phase 3, Phase 4, Phase 5 |
| Priority | Single select | 🔴 High, 🟠 Medium, 🟢 Low |
| Status | Single select | ✅ Done, 🔵 In Progress, ⬜ To Do, 📋 Backlog |
| Module | Single select | Billing, Products, Customers, Inventory, Reports, Printing, Settings, Core |

---

## 6. Quick Setup Commands

After getting write access, push all files:

```bash
cd d:\works\kiranamitra
git add README.md LICENSE CREDITS.md .github/
git commit -m "docs: add README, LICENSE, CREDITS, CI workflow"
git push origin master
```

Then create issues using GitHub CLI (install from https://cli.github.com):

```bash
# Create milestones
gh api repos/hardikkanajariya-in/kiranamitra/milestones -f title="Phase 1 — Core Foundation" -f state=closed -f description="Project setup, database, navigation, theming, i18n"
gh api repos/hardikkanajariya-in/kiranamitra/milestones -f title="Phase 2 — Core Features" -f state=closed -f description="Products, billing, customers, credit, dashboard"
gh api repos/hardikkanajariya-in/kiranamitra/milestones -f title="Phase 3 — Advanced Features" -f state=closed -f description="Printing, PDF, reports, inventory, advance payments"
gh api repos/hardikkanajariya-in/kiranamitra/milestones -f title="Phase 4 — Cloud & Polish" -f state=closed -f description="Google Drive sync, icons, UI polish, CI/CD, docs"
gh api repos/hardikkanajariya-in/kiranamitra/milestones -f title="Phase 5 — Future Enhancements" -f description="Barcode, images, Excel export, WhatsApp, multi-store"

# Create Phase 5 open issues (Phase 1-4 are done, just document them)
gh issue create --title "Barcode scanner integration" --label "phase-5-future,feature,priority-high" --milestone "Phase 5 — Future Enhancements" --body "Add barcode scanning using device camera for quick product lookup during billing. Support common barcode formats (EAN-13, UPC-A, Code 128)."

gh issue create --title "Product image support (camera + gallery)" --label "phase-5-future,feature,priority-high" --milestone "Phase 5 — Future Enhancements" --body "Allow users to add product images via camera capture or gallery selection. Display thumbnails in product list and detail views. Store images locally with WatermelonDB file attachments."

gh issue create --title "Export reports to Excel (XLSX)" --label "phase-5-future,reports,priority-medium" --milestone "Phase 5 — Future Enhancements" --body "Add export functionality to generate Excel spreadsheets from sales and credit reports. Include date range filtering, summary totals, and proper formatting."

gh issue create --title "WhatsApp bill sharing" --label "phase-5-future,billing,priority-medium" --milestone "Phase 5 — Future Enhancements" --body "Share bill receipts directly via WhatsApp using deep linking. Format bill as a readable text message or attach PDF receipt. Include customer phone auto-detection."

gh issue create --title "Multi-store support" --label "phase-5-future,feature,priority-high" --milestone "Phase 5 — Future Enhancements" --body "Support multiple store profiles for shop owners with more than one location. Each store has independent products, inventory, and billing. Allow switching between stores."

gh issue create --title "Customer SMS/WhatsApp payment reminders" --label "phase-5-future,customers,priority-medium" --milestone "Phase 5 — Future Enhancements" --body "Send automated payment reminders to customers with outstanding credit balances. Support both SMS and WhatsApp channels. Include outstanding amount and last payment date."

gh issue create --title "Expense tracking module" --label "phase-5-future,feature,priority-low" --milestone "Phase 5 — Future Enhancements" --body "New feature module to track daily business expenses (rent, electricity, salaries, purchases). Categorize expenses and include in daily P&L reports."

gh issue create --title "Daily profit/loss report" --label "phase-5-future,reports,priority-medium" --milestone "Phase 5 — Future Enhancements" --body "Calculate daily profit/loss by comparing revenue (from bills) vs expenses. Show trends over time. Integrate with expense tracking module."

gh issue create --title "Bulk product import from CSV/Excel" --label "phase-5-future,feature,priority-low" --milestone "Phase 5 — Future Enhancements" --body "Import product catalog from CSV or Excel files. Support mapping columns to product fields (name, price, stock, category). Validate data before import with error preview."

gh issue create --title "Voice search for products (Hindi/Gujarati)" --label "phase-5-future,feature,priority-low" --milestone "Phase 5 — Future Enhancements" --body "Add voice search capability for product lookup during billing. Support Hindi and Gujarati speech recognition using device native APIs. Useful for shopkeepers who prefer voice input."
```

---

## 7. Repository Description & Topics

Set via GitHub CLI:
```bash
gh repo edit hardikkanajariya-in/kiranamitra --description "Free, offline-first POS & inventory app for Indian kirana stores" --add-topic react-native,pos,kirana,inventory,offline-first,watermelondb,typescript,india,billing,android
```
