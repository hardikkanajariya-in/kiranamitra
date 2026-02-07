import React from 'react';
import { render } from '../../renderWithProviders';
import { LanguagePicker } from '@features/settings/components/LanguagePicker';

// Mock settings store
jest.mock('@features/settings/store/useSettingsStore', () => ({
    useSettingsStore: jest.fn(() => ({
        language: 'en',
        setLanguage: jest.fn(),
    })),
}));

describe('LanguagePicker', () => {
    it('should render language title', () => {
        const { getByText } = render(<LanguagePicker />);
        expect(getByText('language')).toBeTruthy();
    });

    it('should render English option', () => {
        const { getByText } = render(<LanguagePicker />);
        expect(getByText('English (English)')).toBeTruthy();
    });

    it('should render Hindi option', () => {
        const { getByText } = render(<LanguagePicker />);
        expect(getByText('हिन्दी (Hindi)')).toBeTruthy();
    });

    it('should render Gujarati option', () => {
        const { getByText } = render(<LanguagePicker />);
        expect(getByText('ગુજરાતી (Gujarati)')).toBeTruthy();
    });
});
