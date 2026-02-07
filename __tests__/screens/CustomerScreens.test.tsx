import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/customers/hooks/useCustomers', () => ({
    useCustomers: jest.fn(() => ({
        customers: [],
        isLoading: false,
    })),
    useCustomerDetail: jest.fn(() => ({
        customer: { id: 'c1', name: 'Test', phone: '123', address: '', notes: '' },
        outstandingCredit: 0,
        isLoading: false,
    })),
}));
jest.mock('@features/customers/repositories/customerRepository', () => ({
    customerRepository: {
        create: jest.fn(),
        update: jest.fn(),
        deactivate: jest.fn(),
        observeAll: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        search: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        observeById: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getCreditEntries: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        addCreditPayment: jest.fn(),
        getOutstandingCredit: jest.fn().mockResolvedValue(0),
    },
}));
jest.mock('@features/billing/repositories/billRepository', () => ({
    billRepository: {
        observeAll: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
    },
}));

import { CustomerListScreen } from '@features/customers/screens/CustomerListScreen';
import { CustomerFormScreen } from '@features/customers/screens/CustomerFormScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

describe('Customer Screens', () => {
    it('should render CustomerListScreen', () => {
        render(<CustomerListScreen navigation={mockNavigation} />);
    });

    it('should render CustomerFormScreen in create mode', () => {
        const route = { params: {} };
        render(<CustomerFormScreen navigation={mockNavigation} route={route} />);
    });
});
