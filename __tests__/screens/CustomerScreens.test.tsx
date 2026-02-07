import React from 'react';
import { render, fireEvent, waitFor } from '../renderWithProviders';
import { Linking } from 'react-native';

const mockUseCustomers = jest.fn();

jest.mock('@features/customers/hooks/useCustomers', () => ({
    useCustomers: (...args: any[]) => mockUseCustomers(...args),
    useCustomerDetail: jest.fn(() => ({
        customer: { id: 'c1', name: 'Test', phone: '123', address: '', notes: '' },
        outstandingCredit: 0,
        isLoading: false,
    })),
}));

const mockGetById = jest.fn();

jest.mock('@features/customers/repositories/customerRepository', () => ({
    customerRepository: {
        create: jest.fn().mockResolvedValue({ id: 'new-c1' }),
        update: jest.fn().mockResolvedValue(undefined),
        deactivate: jest.fn(),
        observeAll: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        search: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        observeById: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getCreditEntries: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        addCreditPayment: jest.fn(),
        getOutstandingCredit: jest.fn().mockResolvedValue(150),
        getById: (...a: any[]) => mockGetById(...a),
    },
}));
jest.mock('@features/billing/repositories/billRepository', () => ({
    billRepository: {
        observeAll: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
    },
}));

jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve(true));

import { CustomerListScreen } from '@features/customers/screens/CustomerListScreen';
import { CustomerFormScreen } from '@features/customers/screens/CustomerFormScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

describe('CustomerListScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseCustomers.mockReturnValue({ customers: [], isLoading: false });
    });

    it('should render empty state when no customers', () => {
        const { getByText } = render(<CustomerListScreen navigation={mockNavigation} />);
        expect(getByText('noCustomers')).toBeTruthy();
        expect(getByText('addCustomer')).toBeTruthy();
    });

    it('should render customer list with data', () => {
        mockUseCustomers.mockReturnValue({
            customers: [
                { id: 'c1', name: 'Raj Kumar', phone: '9876543210' },
                { id: 'c2', name: 'Sita Devi', phone: '9876543211' },
            ],
            isLoading: false,
        });
        const { getByText } = render(<CustomerListScreen navigation={mockNavigation} />);
        expect(getByText('Raj Kumar')).toBeTruthy();
        expect(getByText('Sita Devi')).toBeTruthy();
    });

    it('should show loading when isLoading is true', () => {
        mockUseCustomers.mockReturnValue({ customers: [], isLoading: true });
        render(<CustomerListScreen navigation={mockNavigation} />);
    });

    it('should navigate to add customer', () => {
        const { getByText } = render(<CustomerListScreen navigation={mockNavigation} />);
        fireEvent.press(getByText('addCustomer'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('CustomerForm');
    });

    it('should navigate to customer detail on press', () => {
        mockUseCustomers.mockReturnValue({
            customers: [{ id: 'c1', name: 'Raj', phone: '999' }],
            isLoading: false,
        });
        const { getByText } = render(<CustomerListScreen navigation={mockNavigation} />);
        fireEvent.press(getByText('Raj'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('CustomerDetail', { customerId: 'c1' });
    });

    it('should render search input', () => {
        const { getByPlaceholderText } = render(<CustomerListScreen navigation={mockNavigation} />);
        expect(getByPlaceholderText('searchPlaceholder')).toBeTruthy();
    });
});

describe('CustomerFormScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render form in create mode', () => {
        const route = { params: {} };
        const { getByText } = render(<CustomerFormScreen navigation={mockNavigation} route={route} />);
        expect(getByText('addCustomer')).toBeTruthy();
        expect(getByText('save')).toBeTruthy();
    });

    it('should render all form fields', () => {
        const route = { params: {} };
        const { getAllByText } = render(<CustomerFormScreen navigation={mockNavigation} route={route} />);
        expect(getAllByText('name').length).toBeGreaterThan(0);
        expect(getAllByText('phone').length).toBeGreaterThan(0);
        expect(getAllByText('address').length).toBeGreaterThan(0);
        expect(getAllByText('notes').length).toBeGreaterThan(0);
    });

    it('should render in edit mode with update button', () => {
        mockGetById.mockResolvedValue({
            name: 'Existing', phone: '111', address: 'Addr', notes: 'Note',
        });
        const route = { params: { customerId: 'c1' } };
        const { getByText } = render(<CustomerFormScreen navigation={mockNavigation} route={route} />);
        expect(getByText('editCustomer')).toBeTruthy();
        expect(getByText('update')).toBeTruthy();
    });
});
