# Contributing to KiranaMitra

Thank you for your interest in contributing to KiranaMitra! This document provides guidelines and standards for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

---

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing. We are committed to providing a welcoming and inclusive community.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/kiranamitra.git
   cd kiranamitra
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Run the app** to verify setup:
   ```bash
   npm run start
   npm run android
   ```

---

## Development Workflow

1. Create a branch from `master` following the naming convention below
2. Make your changes in small, focused commits
3. Ensure code passes linting: `npm run lint`
4. Ensure tests pass: `npm run test`
5. Push your branch and create a Pull Request
6. Wait for review from a maintainer

---

## Branch Naming Convention

Use the following prefixes:

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | New feature | `feature/barcode-scanner` |
| `fix/` | Bug fix | `fix/billing-total-calc` |
| `refactor/` | Code refactoring | `refactor/product-store` |
| `docs/` | Documentation only | `docs/api-readme` |
| `chore/` | Build, config, tooling | `chore/update-deps` |
| `i18n/` | Translation updates | `i18n/add-marathi` |
| `ui/` | UI/UX changes | `ui/dark-mode-fixes` |

---

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### Types

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, dependencies |
| `i18n` | Translation additions/updates |

### Scopes

Use the feature module name: `billing`, `products`, `customers`, `inventory`, `reports`, `printing`, `settings`, `dashboard`, `core`, `navigation`, `shared`

### Examples

```
feat(billing): add split payment support
fix(customers): correct credit balance calculation
docs(readme): update installation instructions
i18n(products): add Gujarati translations
chore(deps): upgrade react-native to 0.83
```

---

## Code Standards

### TypeScript

- **No `any` type** — use proper types, generics, or `unknown`
- **No files over 1000 lines** — extract into sub-modules
- Use `as const` objects for enum-like constants
- Derive types with `z.infer<typeof schema>` — never duplicate type definitions
- Use `readonly` where appropriate

### Imports & Path Aliases

```typescript
// ✅ Use path aliases for cross-module imports
import { database } from '@core/database';
import { ProductCard } from '@shared/components/ProductCard';
import { useSettingsStore } from '@features/settings/store/useSettingsStore';

// ✅ Use relative imports within the same feature
import { CartItem } from '../components/CartItem';
import { useBillingStore } from '../store/useBillingStore';

// ❌ Never use deep relative paths across modules
import { database } from '../../../core/database'; // BAD
```

### Components

- **Named exports** for all components, hooks, stores, repositories
- **Default exports** only for WatermelonDB models
- Use `StyleSheet.create()` at the bottom of screen files
- Use React Native Paper components with MD3 theming
- Access theme via `useTheme()` from React Native Paper
- Use `lucide-react-native` icons via the shared `<Icon>` component

### State Management

- Zustand stores: `create<State>()` pattern, named `use<Feature>Store`
- Persisted stores use `persist` middleware with `createJSONStorage(() => zustandMMKVStorage)`
- Ephemeral state (e.g., billing cart) does NOT use persist

### Database

- Models in `src/core/database/models/` extend `Model` with decorators
- Column names: `snake_case` | Class properties: `camelCase`
- Repositories are plain object literal exports (not classes)
- Always use `database.write()` for mutations
- Always bump schema version and add migrations when changing tables

### Forms & Validation

- Use Zod schemas: `camelCaseSchema` naming
- Type naming: `PascalCaseFormData` (e.g., `ProductFormData`)
- Integrate with react-hook-form via `@hookform/resolvers/zod`

### i18n

- Add translations for ALL 3 languages (EN, HI, GU)
- Use proper namespace: `useTranslation('<namespace>')`
- Translation files: `src/core/i18n/locales/{lang}/{namespace}.json`
- Never hardcode user-facing strings

### Dates & Currency

- Use `dayjs` for all date operations
- Currency symbol: `₹` (use `CURRENCY_SYMBOL` constant)
- Use `<CurrencyText>` component for displaying money

---

## Pull Request Process

1. **Fill out the PR template** completely
2. **Link related issues** using `Closes #123` syntax
3. **Keep PRs focused** — one feature/fix per PR
4. **Ensure CI passes** — lint, tests, build
5. **Add screenshots** for UI changes
6. **Update i18n** for all 3 languages if adding user-facing strings
7. **Request review** from a maintainer

### PR Size Guidelines

| Size | Lines Changed | Description |
|---|---|---|
| 🟢 Small | < 100 | Bug fix, small feature, docs |
| 🟡 Medium | 100–500 | Feature, refactor |
| 🟠 Large | 500–1000 | Major feature (split if possible) |
| 🔴 Too Large | > 1000 | Must be split into smaller PRs |

---

## Issue Guidelines

### Bug Reports

Use the bug report template and include:
- Steps to reproduce
- Expected vs actual behavior
- Device info (Android version, device model)
- Screenshots if applicable

### Feature Requests

Use the feature request template and include:
- Clear description of the feature
- Use case / why it's needed
- Proposed implementation (if any)
- Mockups or wireframes (if UI change)

---

## Questions?

Open a discussion or reach out to the maintainer at **hkdevs@hardikkanajariya.in**.

Thank you for helping make KiranaMitra better! 🙏
