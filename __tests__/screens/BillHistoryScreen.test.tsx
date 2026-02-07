import React from 'react';
import { render, fireEvent } from '../renderWithProviders';

const mockBills = [
    { id: 'b1', billNumber: 'B001', grandTotal: 250, paymentMode: 'cash', status: 'completed', createdAt: { getTime: () => Date.now() } },
    { id: 'b2', billNumber: 'B002', grandTotal: 500, paymentMode: 'upi', status: 'completed', createdAt: { getTime: () => Date.now() } },
    { id: 'b3', billNumber: 'B003', grandTotal: 150, paymentMode: 'credit', status: 'completed', createdAt: { getTime: () => Date.now() } },
];

const mockObserveAll = jest.fn();
const mockSearchByBillNumber = jest.fn();

jest.mock('@features/billing/repositories/billRepository', () => ({
    billRepository: {
        observeAll: (...a: any[]) => mockObserveAll(...a),
        searchByBillNumber: (...a: any[]) => mockSearchByBillNumber(...a),
        createBill: jest.fn(),
        getById: jest.fn(),
        observeById: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getBillItems: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        cancelBill: jest.fn(),
        getRecentBills: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        observeByDate: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
    },
}));

jest.mock('@shopify/flash-list', () => ({
    FlashList: ({ data, renderItem }: any) => {
        const { View } = require('react-native');
        return <View>{data?.map((item: any, i: number) => renderItem({ item, index: i }))}</View>;
    },
}));

import { BillHistoryScreen } from '@features/billing/screens/BillHistoryScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

describe('BillHistoryScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockObserveAll.mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb(mockBills);
                return { unsubscribe: jest.fn() };
            }),
        });
        mockSearchByBillNumber.mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb([]);
                return { unsubscribe: jest.fn() };
            }),
        });
    });

    it('should render bill history with bills', () => {
        const { getByText } = render(<BillHistoryScreen navigation={mockNavigation as any} />);
        expect(getByText('billHistory')).toBeTruthy();
        expect(getByText('#B001')).toBeTruthy();
        expect(getByText('#B002')).toBeTruthy();
        expect(getByText('#B003')).toBeTruthy();
    });

    it('should show empty state with no bills', () => {
        mockObserveAll.mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb([]);
                return { unsubscribe: jest.fn() };
            }),
        });
        const { getByText } = render(<BillHistoryScreen navigation={mockNavigation as any} />);
        expect(getByText('noBills')).toBeTruthy();
    });

    it('should render search input', () => {
        const { getByText } = render(<BillHistoryScreen navigation={mockNavigation as any} />);
        expect(getByText('billHistory')).toBeTruthy();
    });

    it('should navigate to bill preview on press', () => {
        const { getByText } = render(<BillHistoryScreen navigation={mockNavigation as any} />);
        fireEvent.press(getByText('#B001'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('BillPreview', { billId: 'b1' });
    });
});
