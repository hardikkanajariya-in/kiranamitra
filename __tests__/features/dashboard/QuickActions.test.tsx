import React from 'react';
import { render } from '../../renderWithProviders';
import { QuickActions } from '@features/dashboard/components/QuickActions';

describe('QuickActions', () => {
    it('should render FAB group', () => {
        render(
            <QuickActions
                onNewBill={jest.fn()}
                onAddCustomer={jest.fn()}
                onAddProduct={jest.fn()}
                onCollectPayment={jest.fn()}
            />
        );
    });

    it('should render without crashing', () => {
        const { UNSAFE_root } = render(
            <QuickActions
                onNewBill={jest.fn()}
                onAddCustomer={jest.fn()}
                onAddProduct={jest.fn()}
                onCollectPayment={jest.fn()}
            />
        );
        expect(UNSAFE_root).toBeTruthy();
    });
});
