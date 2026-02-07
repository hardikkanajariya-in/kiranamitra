import React from 'react';
import { render } from '../renderWithProviders';

const mockBill = {
    id: 'b1',
    billNumber: 'INV-001',
    subtotal: 100,
    discountTotal: 10,
    grandTotal: 90,
    status: 'completed',
    paymentMode: 'cash',
    createdAt: Date.now(),
};
const mockItems = [
    { id: 'bi1', productName: 'Rice', quantity: 2, unitPrice: 50, total: 100, productId: 'p1' },
];

const mockBillObservable = {
    subscribe: jest.fn((cb: any) => {
        cb(mockBill);
        return { unsubscribe: jest.fn() };
    }),
};
const mockItemsObservable = {
    subscribe: jest.fn((cb: any) => {
        cb(mockItems);
        return { unsubscribe: jest.fn() };
    }),
};

jest.mock('@features/billing/repositories/billRepository', () => ({
    billRepository: {
        observeById: jest.fn(() => mockBillObservable),
        getBillItems: jest.fn(() => mockItemsObservable),
    },
}));

jest.mock('@shared/utils/date', () => ({
    formatDate: jest.fn(() => '01 Jan 2025'),
    formatDateTime: jest.fn(() => '01 Jan 2025, 10:00 AM'),
    formatRelative: jest.fn(() => 'today'),
    isToday: jest.fn(() => true),
    getDateRange: jest.fn(),
}));

import { BillPreviewScreen } from '@features/billing/screens/BillPreviewScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: { billId: 'b1' } };

describe('BillPreviewScreen', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should render bill preview with bill details', () => {
        const { getAllByText } = render(
            <BillPreviewScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getAllByText(/#INV-001/).length).toBeGreaterThan(0);
    });

    it('should show loading when bill is null', () => {
        const { billRepository } = require('@features/billing/repositories/billRepository');
        billRepository.observeById.mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                // Don't call callback - keep loading
                return { unsubscribe: jest.fn() };
            }),
        });
        billRepository.getBillItems.mockReturnValue({
            subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
        });
        render(<BillPreviewScreen navigation={mockNavigation} route={mockRoute} />);
    });
});
