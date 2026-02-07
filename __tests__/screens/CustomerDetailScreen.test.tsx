import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/customers/hooks/useCustomers', () => ({
    useCustomers: jest.fn(),
    useCustomerDetail: jest.fn(() => ({
        customer: {
            id: 'c1',
            name: 'Raj Kumar',
            phone: '9876543210',
            address: '123 Market St',
            notes: 'Regular customer',
            isActive: true,
        },
        outstandingCredit: 500,
        isLoading: false,
    })),
}));

jest.mock('@features/customers/repositories/customerRepository', () => ({
    customerRepository: {
        deactivate: jest.fn(),
        addCreditPayment: jest.fn(),
    },
}));

jest.mock('@features/customers/components/CreditLedger', () => ({
    CreditLedger: () => {
        const { View } = require('react-native');
        return <View testID="credit-ledger" />;
    },
}));

import { CustomerDetailScreen } from '@features/customers/screens/CustomerDetailScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: { customerId: 'c1' } };

describe('CustomerDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Re-apply the mock after clear
        const { useCustomerDetail } = require('@features/customers/hooks/useCustomers');
        useCustomerDetail.mockReturnValue({
            customer: {
                id: 'c1',
                name: 'Raj Kumar',
                phone: '9876543210',
                address: '123 Market St',
                notes: 'Regular customer',
                isActive: true,
            },
            outstandingCredit: 500,
            isLoading: false,
        });
    });

    it('should render customer detail with info', () => {
        const { getByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getByText('9876543210')).toBeTruthy();
    });

    it('should show loading when customer data is loading', () => {
        const { useCustomerDetail } = require('@features/customers/hooks/useCustomers');
        useCustomerDetail.mockReturnValue({ customer: null, outstandingCredit: 0, isLoading: true });
        render(<CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />);
    });

    it('should render collect payment button when credit > 0', () => {
        const { getByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getByText('collectPayment')).toBeTruthy();
    });
});
