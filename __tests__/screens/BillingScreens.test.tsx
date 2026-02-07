import React from 'react';
import { render } from '../renderWithProviders';

// Mock all billing dependencies
jest.mock('@features/billing/store/useBillingStore', () => ({
    useBillingStore: jest.fn(() => ({
        cartItems: [],
        subtotal: 0,
        discount: 0,
        grandTotal: 0,
        paymentMode: 'cash',
        selectedCustomerId: null,
        addToCart: jest.fn(),
        updateQuantity: jest.fn(),
        removeFromCart: jest.fn(),
        setPaymentMode: jest.fn(),
        setBillDiscount: jest.fn(),
        setCustomer: jest.fn(),
        clearCart: jest.fn(),
    })),
}));
jest.mock('@features/billing/repositories/billRepository', () => ({
    billRepository: {
        createBill: jest.fn(),
        observeAll: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        observeByDate: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getById: jest.fn(),
        observeById: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getBillItems: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        cancelBill: jest.fn(),
        getRecentBills: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        searchByBillNumber: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
    },
}));
jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        search: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
    },
}));
jest.mock('@features/printing/hooks/usePrinter', () => ({
    usePrinter: jest.fn(() => ({
        printBill: jest.fn(),
        isConnected: false,
        isPrinting: false,
        connectedPrinter: null,
    })),
}));

import { BillingScreen } from '@features/billing/screens/BillingScreen';
import { BillHistoryScreen } from '@features/billing/screens/BillHistoryScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };
const mockRoute = { params: {} };

describe('Billing Screens', () => {
    it('should render BillingScreen', () => {
        const { getByText } = render(<BillingScreen navigation={mockNavigation} />);
        expect(getByText('newBill')).toBeTruthy();
    });

    it('should render BillingScreen with empty cart state', () => {
        const { getByText } = render(<BillingScreen navigation={mockNavigation} />);
        expect(getByText('emptyCart')).toBeTruthy();
    });

    it('should render BillHistoryScreen', () => {
        render(<BillHistoryScreen navigation={mockNavigation} />);
    });
});
