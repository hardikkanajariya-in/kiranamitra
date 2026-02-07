module.exports = {
    preset: 'react-native',
    setupFiles: ['./__tests__/setup.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-paper|react-native-vector-icons|react-native-safe-area-context|react-native-screens|@shopify/flash-list|react-native-svg|react-native-mmkv|@nozbe/watermelondb)/)',
    ],
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/app/$1',
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/android/', '<rootDir>/ios/'],
    testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/__tests__/**',
        '!src/navigation/types.ts',
        '!src/core/types/**',
        '!src/core/database/index.ts',
        '!src/core/database/models/**',
    ],
};
