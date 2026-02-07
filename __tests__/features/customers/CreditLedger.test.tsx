import React from 'react';
import { render } from '../../renderWithProviders';
import { CreditLedger } from '@features/customers/components/CreditLedger';

// Mock repository
jest.mock('@features/customers/repositories/customerRepository', () => ({
    customerRepository: {
        getCreditEntries: jest.fn().mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb([]);
                return { unsubscribe: jest.fn() };
            }),
        }),
    },
}));

describe('CreditLedger', () => {
    it('should render empty state when no entries', () => {
        const { getByText } = render(<CreditLedger customerId="c1" />);
        expect(getByText('noTransactions')).toBeTruthy();
    });

    it('should render with customer id', () => {
        render(<CreditLedger customerId="c1" />);
    });
});
