/**
 * Tests for useCustomers and useCustomerDetail hooks
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';

const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock('@features/customers/repositories/customerRepository', () => ({
    customerRepository: {
        observeAll: jest.fn(() => ({
            subscribe: (cb: any) => {
                cb([{ id: 'c1', name: 'Raj' }, { id: 'c2', name: 'Amit' }]);
                return { unsubscribe: mockUnsubscribe };
            },
        })),
        search: jest.fn((query: string) => ({
            subscribe: (cb: any) => {
                cb([{ id: 'c1', name: 'Raj' }]);
                return { unsubscribe: mockUnsubscribe };
            },
        })),
        observeById: jest.fn((id: string) => ({
            subscribe: (cb: any) => {
                cb({ id, name: 'Raj', phone: '9876543210' });
                return { unsubscribe: mockUnsubscribe };
            },
        })),
        getOutstandingCredit: jest.fn().mockResolvedValue(500),
    },
}));

jest.mock('@shared/hooks/useDebounce', () => ({
    useDebounce: jest.fn((value: any) => value),
}));

import { useCustomers, useCustomerDetail } from '@features/customers/hooks/useCustomers';

describe('useCustomers', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return customers from observeAll when no search query', () => {
        const { result } = renderHook(() => useCustomers());
        expect(result.current.customers).toHaveLength(2);
        expect(result.current.isLoading).toBe(false);
    });

    it('should search customers when query is provided', () => {
        const { result } = renderHook(() => useCustomers('Raj'));
        const { customerRepository } = require('@features/customers/repositories/customerRepository');
        expect(customerRepository.search).toHaveBeenCalledWith('Raj');
    });

    it('should unsubscribe on unmount', () => {
        const { unmount } = renderHook(() => useCustomers());
        unmount();
        expect(mockUnsubscribe).toHaveBeenCalled();
    });
});

describe('useCustomerDetail', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return customer detail and outstanding credit', async () => {
        const { result } = renderHook(() => useCustomerDetail('c1'));
        expect(result.current.customer).toBeTruthy();
        expect(result.current.customer?.name).toBe('Raj');
        expect(result.current.isLoading).toBe(false);
        await waitFor(() => {
            expect(result.current.outstandingCredit).toBe(500);
        });
    });

    it('should call observeById with customer ID', () => {
        renderHook(() => useCustomerDetail('c1'));
        const { customerRepository } = require('@features/customers/repositories/customerRepository');
        expect(customerRepository.observeById).toHaveBeenCalledWith('c1');
    });
});
