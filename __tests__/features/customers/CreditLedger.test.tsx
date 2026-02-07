import React from 'react';
import { render } from '../../renderWithProviders';
import { CreditLedger } from '@features/customers/components/CreditLedger';

const mockGetCreditEntries = jest.fn();

jest.mock('@features/customers/repositories/customerRepository', () => ({
    customerRepository: {
        getCreditEntries: (...a: any[]) => mockGetCreditEntries(...a),
    },
}));

jest.mock('@shopify/flash-list', () => ({
    FlashList: ({ data, renderItem, ItemSeparatorComponent }: any) => {
        const { View } = require('react-native');
        return (
            <View>
                {data?.map((item: any, i: number) => (
                    <View key={i}>
                        {renderItem({ item, index: i })}
                        {ItemSeparatorComponent && i < data.length - 1 && <ItemSeparatorComponent />}
                    </View>
                ))}
            </View>
        );
    },
}));

const creditEntries = [
    { id: 'e1', entryType: 'credit', amount: 500, balanceAfter: 500, notes: 'Purchase on credit', createdAt: new Date('2024-01-15') },
    { id: 'e2', entryType: 'payment', amount: 200, balanceAfter: 300, notes: '', createdAt: new Date('2024-01-20') },
];

describe('CreditLedger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetCreditEntries.mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb([]);
                return { unsubscribe: jest.fn() };
            }),
        });
    });

    it('should render empty state when no entries', () => {
        const { getByText } = render(<CreditLedger customerId="c1" />);
        expect(getByText('noTransactions')).toBeTruthy();
        expect(getByText('noTransactionsSubtitle')).toBeTruthy();
    });

    it('should render credit entries with correct labels', () => {
        mockGetCreditEntries.mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb(creditEntries);
                return { unsubscribe: jest.fn() };
            }),
        });
        const { getByText } = render(<CreditLedger customerId="c1" />);
        expect(getByText('credit')).toBeTruthy();
        expect(getByText('payment')).toBeTruthy();
    });

    it('should show notes when present', () => {
        mockGetCreditEntries.mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb(creditEntries);
                return { unsubscribe: jest.fn() };
            }),
        });
        const { getByText } = render(<CreditLedger customerId="c1" />);
        expect(getByText('Purchase on credit')).toBeTruthy();
    });

    it('should show balance after entry', () => {
        mockGetCreditEntries.mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb([creditEntries[0]]);
                return { unsubscribe: jest.fn() };
            }),
        });
        const { getByText } = render(<CreditLedger customerId="c1" />);
        expect(getByText('balance: ₹500.00')).toBeTruthy();
    });

    it('should call getCreditEntries with correct customerId', () => {
        render(<CreditLedger customerId="customer-123" />);
        expect(mockGetCreditEntries).toHaveBeenCalledWith('customer-123');
    });

    it('should unsubscribe on unmount', () => {
        const mockUnsub = jest.fn();
        mockGetCreditEntries.mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb([]);
                return { unsubscribe: mockUnsub };
            }),
        });
        const { unmount } = render(<CreditLedger customerId="c1" />);
        unmount();
        expect(mockUnsub).toHaveBeenCalled();
    });
});
