import React from 'react';
import { render } from '../../renderWithProviders';
import { ThemeToggle } from '@features/settings/components/ThemeToggle';

// Mock settings store
jest.mock('@features/settings/store/useSettingsStore', () => ({
    useSettingsStore: jest.fn(() => ({
        isDarkMode: false,
        setDarkMode: jest.fn(),
        language: 'en',
        setLanguage: jest.fn(),
        storeProfile: { name: '', address: '', phone: '', gstNumber: '' },
        setStoreProfile: jest.fn(),
    })),
}));

describe('ThemeToggle', () => {
    it('should render dark mode label', () => {
        const { getByText } = render(<ThemeToggle />);
        expect(getByText('darkMode')).toBeTruthy();
    });

    it('should render description', () => {
        const { getByText } = render(<ThemeToggle />);
        expect(getByText('darkModeDesc')).toBeTruthy();
    });

    it('should render switch', () => {
        render(<ThemeToggle />);
    });
});
