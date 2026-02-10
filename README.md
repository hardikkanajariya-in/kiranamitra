<p align="center">
  <img src="logo/app-icon-1024.png" width="120" alt="KiranaMitra Logo" />
</p>

<h1 align="center">KiranaMitra</h1>

<p align="center">
  <strong>Free, offline-first POS & inventory app for Indian kirana stores</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.83-blue?logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green" alt="Platform" />
  <img src="https://img.shields.io/badge/Database-WatermelonDB-orange" alt="Database" />
  <img src="https://img.shields.io/badge/License-Custom-yellow" alt="License" />
  <img src="https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/i18n-EN%20%7C%20HI%20%7C%20GU-purple" alt="Languages" />
</p>

---

## About

**KiranaMitra** (किराना मित्र — "Grocery Friend") is a completely free, open-source Point of Sale and inventory management application built specifically for Indian kirana (grocery) stores. It works entirely offline with no subscription, no server, and no internet dependency.

All data stays on your device using WatermelonDB (SQLite). Optional Google Drive backup keeps your data safe.

---

## Features

| Module | Description |
|---|---|
| 📊 **Dashboard** | Real-time sales overview, today's revenue, top products, credit summary |
| 🛒 **Billing (POS)** | Fast product search, cart management, multiple payment modes (cash, UPI, credit) |
| 📦 **Products** | Product catalog with categories, pricing (MRP/selling), low stock alerts |
| 📋 **Inventory** | Stock-in/stock-out tracking, inventory adjustment logs |
| 👥 **Customers** | Customer directory, credit (udhar) ledger, advance payment wallet |
| 🧾 **Receipts** | PDF bill generation, Bluetooth thermal printer support (ESC/POS) |
| 📈 **Reports** | Sales reports, credit reports, filterable by date range |
| ☁️ **Google Drive Sync** | Auto-backup database to Google Drive, restore on new device |
| 🌐 **Multi-language** | English, Hindi (हिंदी), Gujarati (ગુજરાતી) |
| 🌙 **Dark Mode** | Full dark/light theme support with Material Design 3 |
| 💾 **Offline-First** | No internet required — everything runs locally |

### Billing Highlights

- Quick product search with barcode/name
- Cart with quantity adjustment
- Split payment (Cash + UPI + Credit)
- Customer credit (udhar) tracking with automatic ledger
- Advance payment / wallet system for customer overpayments
- Instant PDF receipt / thermal print

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native 0.83 (New Architecture) |
| **Language** | TypeScript 5.8 |
| **UI** | React Native Paper (Material Design 3) |
| **Navigation** | React Navigation 7 (Native Stack + Bottom Tabs) |
| **Database** | WatermelonDB (SQLite, offline-first) |
| **State** | Zustand + MMKV (persisted stores) |
| **Forms** | React Hook Form + Zod validation |
| **i18n** | i18next (EN / HI / GU) |
| **Icons** | Lucide React Native |
| **Lists** | Shopify FlashList |
| **Dates** | Day.js |
| **Printing** | Bluetooth ESC/POS thermal printer |
| **PDF** | react-native-html-to-pdf + react-native-share |
| **Backup** | Google Drive API + Google Sign-In |
| **Storage** | MMKV (fast key-value) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **JDK** 17
- **Android Studio** with SDK 34+
- **Android device or emulator**

### Installation

```bash
# Clone the repository
git clone https://github.com/hardikkanajariya-in/kiranamitra.git
cd kiranamitra

# Install dependencies
npm install

# Start Metro bundler
npm run start

# Run on Android (in another terminal)
npm run android
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run start` | Start Metro bundler |
| `npm run lint` | ESLint check |
| `npm run test` | Run Jest tests |
| `npm run build:android:debug` | Build debug APK |
| `npm run build:android:release` | Build release APK |
| `npm run clean` | Clean Android build dirs |

### Release Build (CI)

A GitHub Actions workflow is included. Go to **Actions** → **Build Release APK** → **Run workflow** to generate a signed APK.

---

## Project Structure

```
src/
├── core/                   # Shared infrastructure
│   ├── constants/          # App-wide constants (as const objects)
│   ├── database/           # WatermelonDB setup, models, schema, migrations
│   ├── i18n/               # i18next config + locales (en/hi/gu)
│   ├── storage/            # MMKV + Zustand persist adapters
│   ├── theme/              # MD3 light/dark themes, colors, fonts
│   └── types/              # Shared TypeScript types
│
├── features/               # Feature modules
│   ├── billing/            # POS billing screen, cart store, bill repository
│   ├── customers/          # Customer CRUD, credit ledger, advance payments
│   ├── dashboard/          # Sales overview, charts, quick stats
│   ├── inventory/          # Stock management, adjustment logs
│   ├── printing/           # Bluetooth printer setup, ESC/POS service
│   ├── products/           # Product catalog, categories, seeder
│   ├── reports/            # Sales & credit reports, PDF export
│   └── settings/           # App settings, backup/restore, Google Drive sync
│
├── navigation/             # React Navigation stacks & tab navigator
├── services/               # Cross-cutting services (backup, Google Drive sync)
└── shared/                 # Reusable components, hooks, utilities
    ├── components/         # AppHeader, FormField, CurrencyText, Icon, etc.
    ├── hooks/              # useObservable, useAutoSync, etc.
    └── utils/              # Formatting, helpers
```

### Feature Module Pattern

Each feature follows a consistent structure:

```
features/<name>/
├── screens/        # Screen components
├── components/     # Feature-local UI components
├── store/          # Zustand store (use<Name>Store.ts)
├── repositories/   # WatermelonDB data access
├── schemas/        # Zod validation schemas
├── hooks/          # Feature-specific hooks
└── services/       # Feature-specific services
```

---

## Database Schema

| Table | Description |
|---|---|
| `customers` | Customer profiles with name, phone, address |
| `categories` | Product categories |
| `products` | Product catalog (name, SKU, MRP, selling price, stock) |
| `inventory_logs` | Stock-in/stock-out history |
| `bills` | Bill headers (date, totals, payment mode, customer) |
| `bill_items` | Line items per bill |
| `payments` | Payment records per bill |
| `credit_entries` | Credit/payment/advance ledger per customer |

---

## Internationalization

Supported languages:

| Code | Language | Script |
|---|---|---|
| `en` | English | Latin |
| `hi` | Hindi | देवनागरी |
| `gu` | Gujarati | ગુજરાતી |

9 namespaces: `common`, `auth`, `billing`, `customers`, `dashboard`, `inventory`, `products`, `reports`, `settings`

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please follow the existing code conventions:
- Use TypeScript with no `any` types
- Use path aliases (`@core/*`, `@features/*`, `@shared/*`)
- Follow the feature module structure
- Add i18n keys for all user-facing strings (all 3 languages)

---

## Roadmap

See the [open issues](https://github.com/hardikkanajariya-in/kiranamitra/issues) for the full list of planned features and known issues.

### Phase 1 — Core Foundation ✅
- [x] Project setup (React Native 0.83, TypeScript)
- [x] WatermelonDB schema & models
- [x] Navigation structure (stacks + tabs)
- [x] Theme system (MD3 light/dark)
- [x] i18n setup (EN/HI/GU)

### Phase 2 — Core Features ✅
- [x] Product management (CRUD, categories)
- [x] Billing / POS screen
- [x] Customer management
- [x] Credit (udhar) system
- [x] Dashboard with stats

### Phase 3 — Advanced Features ✅
- [x] Bluetooth thermal printing
- [x] PDF receipt generation
- [x] Reports (sales, credit)
- [x] Inventory stock tracking
- [x] Advance payment / wallet

### Phase 4 — Cloud & Polish ✅
- [x] Google Drive sync & backup
- [x] Auto-sync on data changes
- [x] App icon generation
- [x] UI/UX polish pass
- [x] CI/CD (GitHub Actions)

### Phase 5 — Upcoming 🚧
- [ ] Barcode scanner integration
- [ ] Product image support
- [ ] Export reports to Excel
- [ ] WhatsApp bill sharing
- [ ] Multi-store support

---

## Author

**Hardik Kanajariya**

- 🌐 Website: [hardikkanajariya.in](https://www.hardikkanajariya.in)
- 🐙 GitHub: [@hardik-kanajariya](https://github.com/hardik-kanajariya)
- 💼 LinkedIn: [Hardik Kanajariya](https://www.linkedin.com/in/hardik-kanajariya/)
- 🐦 Twitter: [@hardik_web](https://x.com/hardik_web)
- 📧 Email: hkdevs@hardikkanajariya.in

---

## License

This project is **free to use** for personal and non-commercial purposes. The source code is open for learning and contributions but **not for commercial resale** without permission.

See [LICENSE](./LICENSE) for full terms.

---

<p align="center">Made with ❤️ in India</p>
