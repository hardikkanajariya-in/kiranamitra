/**
 * Tests for useDashboardData hook
 */
import { renderHook } from '@testing-library/react-native';

const mockUnsubscribe = jest.fn();
const mockBills = [
    { id: 'b1', grandTotal: 100, paymentMode: 'cash', createdAt: Date.now(), status: 'completed' },
    { id: 'b2', grandTotal: 200, paymentMode: 'upi', createdAt: Date.now(), status: 'completed' },
];

jest.mock('@core/database', () => ({
    database: {
        get: jest.fn((table: string) => ({
            query: jest.fn(() => ({
                observe: jest.fn(() => ({
                    subscribe: (cb: any) => {
                        if (table === 'bills') {
                            cb(mockBills);
                        } else if (table === 'customers') {
                            cb([{ id: 'c1' }, { id: 'c2' }]);
                        } else if (table === 'products') {
                            cb([
                                { id: 'p1', currentStock: 3, lowStockThreshold: 10, isLowStock: true, isOutOfStock: false },
                                { id: 'p2', currentStock: 0, lowStockThreshold: 5, isLowStock: false, isOutOfStock: true },
                            ]);
                        } else if (table === 'credit_entries') {
                            cb([{ balanceAfter: 500 }]);
                        } else {
                            cb([]);
                        }
                        return { unsubscribe: mockUnsubscribe };
                    },
                })),
                fetch: jest.fn(() => Promise.resolve([])),
                fetchCount: jest.fn(() => Promise.resolve(0)),
            })),
        })),
    },
}));

jest.mock('@nozbe/watermelondb', () => ({
    Q: {
        where: jest.fn(),
        gte: jest.fn(),
        lte: jest.fn(),
        notEq: jest.fn(),
        sortBy: jest.fn(),
        take: jest.fn(),
        desc: 'desc',
    },
}));

import { useDashboardData } from '@features/dashboard/hooks/useDashboardData';

describe('useDashboardData', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return dashboard data', () => {
        const { result } = renderHook(() => useDashboardData());
        expect(result.current).toBeDefined();
    });

    it('should have isLoading property', () => {
        const { result } = renderHook(() => useDashboardData());
        expect(result.current).toHaveProperty('isLoading');
    });
});
