import React from 'react';
import { render } from '../../renderWithProviders';
import { StoreProfileForm } from '@features/settings/components/StoreProfileForm';

jest.mock('@features/settings/store/useSettingsStore', () => ({
    useSettingsStore: jest.fn(() => ({
        storeProfile: { name: 'My Store', address: '123 Main St', phone: '9876543210', gstNumber: 'GST123' },
        setStoreProfile: jest.fn(),
    })),
}));

describe('StoreProfileForm', () => {
    it('should render store profile title', () => {
        const { getByText } = render(<StoreProfileForm />);
        expect(getByText('storeProfile')).toBeTruthy();
    });

    it('should render store name input', () => {
        const { getByDisplayValue } = render(<StoreProfileForm />);
        expect(getByDisplayValue('My Store')).toBeTruthy();
    });

    it('should render address input', () => {
        const { getByDisplayValue } = render(<StoreProfileForm />);
        expect(getByDisplayValue('123 Main St')).toBeTruthy();
    });

    it('should render save button', () => {
        const { getByText } = render(<StoreProfileForm />);
        expect(getByText('save')).toBeTruthy();
    });
});
