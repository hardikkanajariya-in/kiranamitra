import React from 'react';
import { render } from '../../renderWithProviders';
import { PinManagement } from '@features/settings/components/PinManagement';

jest.mock('@features/auth/store/useAuthStore', () => ({
    useAuthStore: jest.fn(() => ({
        verifyAndLogin: jest.fn().mockReturnValue(true),
        changePin: jest.fn().mockReturnValue(true),
    })),
}));

describe('PinManagement', () => {
    it('should render pin management title', () => {
        const { getByText } = render(<PinManagement />);
        expect(getByText('pinManagement')).toBeTruthy();
    });

    it('should render change pin button', () => {
        const { getByText } = render(<PinManagement />);
        expect(getByText('changePin')).toBeTruthy();
    });

    it('should render description', () => {
        const { getByText } = render(<PinManagement />);
        expect(getByText('pinDesc')).toBeTruthy();
    });
});
