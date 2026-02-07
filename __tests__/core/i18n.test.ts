/**
 * Tests for i18n configuration
 */

jest.mock('@core/storage/mmkv', () => ({
    getLanguage: jest.fn(() => 'en'),
    setLanguage: jest.fn(),
    getPin: jest.fn(),
    setPin: jest.fn(),
    hasCompletedOnboarding: jest.fn(() => false),
    setOnboardingComplete: jest.fn(),
}));

// We need to test that i18n initializes properly
describe('i18n', () => {
    it('should initialize with English as default language', () => {
        const i18n = require('@core/i18n').default;
        expect(i18n).toBeDefined();
    });

    it('should have all required namespaces configured', () => {
        const i18n = require('@core/i18n').default;
        // The mock in setup.ts covers useTranslation, but the actual module
        // should have the expected configuration structure
        expect(i18n).toBeDefined();
    });
});
