# KiranaMitra — Copilot Instructions

## Project Overview
KiranaMitra is an **offline-first React Native 0.83** POS/inventory app for Indian kirana (grocery) stores. It runs on Android (primary) and iOS. All data lives locally in **WatermelonDB** (SQLite); there is no backend server.

## Architecture
```
src/
  core/          — database, i18n, theme, storage, constants, types (shared infra)
  features/      — feature modules: auth, billing, customers, dashboard, inventory, printing, products, reports, settings
  navigation/    — React Navigation stacks & tab navigator
  services/      — cross-cutting services (backupService)
  shared/        — reusable components, hooks, utils
```

**Key libraries:** React Native Paper (MD3 UI), Zustand + MMKV (state/persistence), WatermelonDB (database), Zod (validation), react-hook-form (forms), i18next (en/hi/gu), dayjs (dates), lucide-react-native (icons).

**Path aliases** (`@core/*`, `@features/*`, `@shared/*`, `@services/*`, `@assets/*`) are configured in both `babel.config.js` (module-resolver) and `tsconfig.json`. Always use aliases for cross-module imports; use relative imports only within the same feature folder.

## Feature Module Structure
Each feature in `src/features/<name>/` follows this layout:
- **`screens/`** — Screen components (named export, e.g. `export const BillingScreen`)
- **`components/`** — Feature-local UI components
- **`store/`** — Zustand store (`use<Name>Store.ts`)
- **`repositories/`** — WatermelonDB data access (`<name>Repository.ts`, object-literal export)
- **`schemas/`** — Zod validation schemas (`<name>Schema.ts`)
- **`hooks/`** — Feature-specific React hooks
- **`services/`** — Feature-specific services (e.g. printing, reports)

Not every feature has all subdirectories — only create what's needed.

## Data Layer — WatermelonDB
- **Models** live in `src/core/database/models/` and extend `Model` with `export default class`.
- Use decorators: `@text` (strings), `@field` (numbers/booleans), `@date` (dates), `@readonly @date` (auto-updated), `@immutableRelation` (belongs_to), `@children` (has_many).
- Column names are **snake_case**; class properties are **camelCase**.
- **Schema** is in `src/core/database/schema.ts`; **migrations** in `src/core/database/migrations.ts`. Bump schema version and add migration steps when modifying tables.
- All models are registered in `src/core/database/index.ts`.
- **Repositories** (e.g. `productRepository`, `billRepository`) are plain object literal exports that wrap `database.write()` for mutations and return `.observe()` observables for reactive queries. Use `Q` query builder from WatermelonDB for filtering.

## State Management — Zustand + MMKV
- Stores use `create<State>()` from Zustand. Name: `use<Feature>Store`.
- For persisted stores, use `persist` middleware with `createJSONStorage(() => zustandMMKVStorage)`. See `useAuthStore` or `useSettingsStore` for the pattern.
- Ephemeral session state (e.g. billing cart) does NOT use persist middleware.
- MMKV helpers for atomic values (PIN, language, theme) are in `src/core/storage/mmkv.ts`.

## Validation — Zod
- Schema naming: `camelCaseSchema` (e.g. `productSchema`). Type naming: `PascalCaseFormData` (e.g. `ProductFormData`).
- Always derive types via `z.infer<typeof schema>` — never duplicate type definitions.
- Integrate with react-hook-form via `@hookform/resolvers`.

## Navigation
- **React Navigation 7** with native stacks + bottom tabs.
- Each tab wraps a stack navigator. Tab names are suffixed `Tab` (e.g. `DashboardTab`).
- Param list types are in `src/navigation/types.ts` — one `ParamList` per stack.
- Use `CompositeScreenProps` for type-safe navigation across nested navigators.

## UI & Theming
- All UI uses **React Native Paper** components with MD3 theming.
- Theme is in `src/core/theme/` — `colors.ts` defines palette, `index.ts` extends `MD3LightTheme`/`MD3DarkTheme`.
- Access theme via `useTheme()` from React Native Paper. Access `isDarkMode` from `useSettingsStore`.
- Icons: use `lucide-react-native` via the shared `<Icon>` component (`@shared/components/Icon`).
- Shared components: `AppHeader`, `FormField`, `CurrencyText`, `SearchInput`, `EmptyState`, `StatusBadge`, `ConfirmDialog`, `LoadingOverlay`.

## i18n
- 3 languages: English (`en`), Hindi (`hi`), Gujarati (`gu`). 9 namespaces matching features.
- Translation files: `src/core/i18n/locales/{lang}/{namespace}.json`.
- Use `useTranslation('<namespace>')` in components. Default namespace is `common`.

## Constants & Types
- Enum-like constants in `src/core/constants/index.ts` use `as const` objects with `UPPER_SNAKE_CASE`. Derive types via `(typeof OBJ)[keyof typeof OBJ]`.
- Shared interfaces/DTOs in `src/core/types/index.ts`.
- Currency symbol is `₹` (`CURRENCY_SYMBOL` constant).

## Key Commands
```bash
npm run android          # Run on Android device/emulator
npm run start            # Start Metro bundler
npm run lint             # ESLint check
npm run test             # Jest tests
npm run build:android:debug    # Build debug APK
npm run build:android:release  # Build release APK
npm run clean                  # Clean Android build dirs
```
`postinstall` runs `patch-package` — patches are in `patches/`.

## Code Conventions
- **No `any` type** — use proper types or generics.
- **No file over 1000 lines** — extract into sub-modules.
- Named exports for components, hooks, stores, repositories. Default exports only for WatermelonDB models.
- Screens receive navigation prop and use `StyleSheet.create()` at the bottom.
- Services and repositories are object literal exports (not classes), except where interface abstraction is needed (e.g. `PrinterService` interface with `BluetoothPrinterService` class).
- Use `dayjs` for date operations, `nanoid` for ID generation.
