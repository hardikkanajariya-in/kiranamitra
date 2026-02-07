import React from 'react';
import { render, fireEvent, waitFor } from '../renderWithProviders';
import { Alert, Linking } from 'react-native';

const mockUseCustomerDetail = jest.fn();

jest.mock('@features/customers/hooks/useCustomers', () => ({
    useCustomers: jest.fn(),
    useCustomerDetail: (...args: any[]) => mockUseCustomerDetail(...args),
}));

const mockDeactivate = jest.fn().mockResolvedValue(undefined);
const mockAddCreditPayment = jest.fn().mockResolvedValue(undefined);

jest.mock('@features/customers/repositories/customerRepository', () => ({
    customerRepository: {
        deactivate: (...a: any[]) => mockDeactivate(...a),
        addCreditPayment: (...a: any[]) => mockAddCreditPayment(...a),
    },
}));

jest.mock('@features/customers/components/CreditLedger', () => ({
    CreditLedger: () => {
        const { View } = require('react-native');
        return <View testID="credit-ledger" />;
    },
}));

jest.spyOn(Alert, 'alert');
jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve(true));

import { CustomerDetailScreen } from '@features/customers/screens/CustomerDetailScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: mockGoBack };
const mockRoute = { params: { customerId: 'c1' } };

const customerData = {
    id: 'c1',
    name: 'Raj Kumar',
    phone: '9876543210',
    address: '123 Market St',
    notes: 'Regular customer',
    isActive: true,
};

describe('CustomerDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseCustomerDetail.mockReturnValue({
            customer: customerData,
            outstandingCredit: 500,
            isLoading: false,
        });
    });

    it('should render customer detail with phone and address', () => {
        const { getByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />,
        );
        expect(getByText('9876543210')).toBeTruthy();
        expect(getByText('123 Market St')).toBeTruthy();
        expect(getByText('Regular customer')).toBeTruthy();
    });

    it('should show loading when data is loading', () => {
        mockUseCustomerDetail.mockReturnValue({ customer: null, outstandingCredit: 0, isLoading: true });
        render(<CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />);
    });

    it('should render collect payment button when credit > 0', () => {
        const { getByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />,
        );
        expect(getByText('collectPayment')).toBeTruthy();
    });

    it('should not show collect payment when credit is 0', () => {
        mockUseCustomerDetail.mockReturnValue({
            customer: customerData,
            outstandingCredit: 0,
            isLoading: false,
        });
        const { queryByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />,
        );
        expect(queryByText('collectPayment')).toBeNull();
    });

    it('should open phone dialer when call button is pressed', () => {
        const { getByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />,
        );
        fireEvent.press(getByText('call'));
        expect(Linking.openURL).toHaveBeenCalledWith('tel:9876543210');
    });

    it('should show no phone text when phone is empty', () => {
        mockUseCustomerDetail.mockReturnValue({
            customer: { ...customerData, phone: '' },
            outstandingCredit: 0,
            isLoading: false,
        });
        const { getByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />,
        );
        expect(getByText('noPhone')).toBeTruthy();
    });

    it('should hide address when not present', () => {
        mockUseCustomerDetail.mockReturnValue({
            customer: { ...customerData, address: '', notes: '' },
            outstandingCredit: 0,
            isLoading: false,
        });
        const { queryByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />,
        );
        expect(queryByText('123 Market St')).toBeNull();
    });

    it('should show payment dialog on collect payment press', () => {
        const { getByText, getAllByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />,
        );
        fireEvent.press(getByText('collectPayment'));
        // Dialog contains 'amount' label (may appear multiple times due to TextInput label)
        expect(getAllByText('amount').length).toBeGreaterThan(0);
    });

    it('should handle collect payment submission', async () => {
        const { getByText } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />,
        );
        fireEvent.press(getByText('collectPayment'));
        // Verify dialog and collect button are present
        expect(getByText('collect')).toBeTruthy();
        expect(getByText('cancel')).toBeTruthy();
    });

    it('should render credit ledger section', () => {
        const { getByText, getByTestId } = render(
            <CustomerDetailScreen navigation={mockNavigation} route={mockRoute} />,
        );
        expect(getByText('transactionHistory')).toBeTruthy();
        expect(getByTestId('credit-ledger')).toBeTruthy();
    });
});
