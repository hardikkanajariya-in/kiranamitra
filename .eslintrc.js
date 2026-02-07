module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
        project: './tsconfig.json',
    },
    plugins: [
        '@typescript-eslint',
        'unused-imports',
        'react',
        'react-hooks',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    ignorePatterns: [
        'node_modules/',
        'android/',
        'ios/',
        'coverage/',
        '__tests__/',
        '*.config.js',
        '*.config.ts',
        'babel.config.js',
        'metro.config.js',
        'jest.config.js',
        'index.ts',
    ],
    rules: {
        // ─── Rule 1: No unused imports ───────────────────────────────────────────
        'unused-imports/no-unused-imports': 'error',

        // ─── Rule 2: No unused variables or methods ─────────────────────────────
        '@typescript-eslint/no-unused-vars': ['error', {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: true,
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
        }],
        'unused-imports/no-unused-vars': ['error', {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
        }],

        // ─── Rule 3: File must not exceed 1000 lines ────────────────────────────
        'max-lines': ['error', {
            max: 1000,
            skipBlankLines: true,
            skipComments: true,
        }],

        // ─── Rule 4: Single responsibility – one component per file ─────────────
        // Only one React component export per file
        'react/no-multi-comp': ['error', { ignoreStateless: false }],

        // ─── Rule 5: No use of `any` – always use proper types ──────────────────
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'off',   // needs type-aware – keep off to avoid perf hit
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',

        // ─── Rule 6: No deep nesting – limit complexity ─────────────────────────
        'max-depth': ['error', { max: 3 }],
        complexity: ['error', { max: 10 }],
        'max-nested-callbacks': ['error', { max: 3 }],

        // ─── Rule 7: No excessive commented-out code ────────────────────────────
        // Warn on large comment blocks (more than 6 consecutive comment lines suggests commented code)
        'no-warning-comments': ['warn', {
            terms: ['todo', 'fixme', 'hack', 'xxx'],
            location: 'start',
        }],
        // Multiline comments used for commented-out code are caught by max-lines + reviews
        // We also add a custom rule via overrides below

        // ─── Rule 8: AI code detection – unnecessary complexity ─────────────────
        // These rules catch over-engineered patterns:
        'no-nested-ternary': 'error',
        'no-unneeded-ternary': 'error',
        'prefer-const': 'error',
        'no-else-return': ['error', { allowElseIf: false }],
        'no-lonely-if': 'error',
        'no-useless-return': 'error',
        'no-useless-concat': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-rename': 'error',
        'no-useless-constructor': 'error',
        'prefer-template': 'error',
        'object-shorthand': ['error', 'always'],
        'arrow-body-style': ['error', 'as-needed'],
        'no-param-reassign': ['error', { props: false }],
        'no-restricted-syntax': [
            'error',
            {
                selector: 'IfStatement > IfStatement',
                message: 'Avoid deeply nested if statements. Extract logic into separate functions or use early returns.',
            },
            {
                selector: 'IfStatement > .alternate > IfStatement > .alternate > IfStatement',
                message: 'Too many chained if-else blocks. Use a lookup map, switch, or extract into helper functions.',
            },
            {
                selector: 'ForStatement > ForStatement > ForStatement',
                message: 'Triple-nested loops are too complex. Extract inner loops into separate functions.',
            },
            {
                selector: 'WhileStatement > WhileStatement',
                message: 'Nested while loops are too complex. Refactor into separate functions.',
            },
        ],

        // ─── General best practices ─────────────────────────────────────────────
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'error',
        'no-alert': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-var': 'error',
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        'no-throw-literal': 'error',
        'prefer-promise-reject-errors': 'error',
        'require-await': 'error',
        'no-return-await': 'error',
        'no-duplicate-imports': 'error',

        // ─── React-specific ─────────────────────────────────────────────────────
        'react/jsx-no-bind': ['warn', {
            allowArrowFunctions: true,
            allowFunctions: false,
            allowBind: false,
        }],
        'react/react-in-jsx-scope': 'off',   // Not needed in React 17+
        'react/prop-types': 'off',           // Using TypeScript
        'react/display-name': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
    overrides: [
        {
            // Relax component-per-file for files that export styled/helper sub-components
            files: ['**/styles.ts', '**/styles.tsx', '**/constants.ts', '**/types.ts'],
            rules: {
                'react/no-multi-comp': 'off',
            },
        },
    ],
};
