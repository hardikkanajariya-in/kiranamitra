/**
 * Tests for billRepository
 */

// Define mock functions that will be used inside jest.mock factory via arrow wrappers
const mockObserve = jest.fn(() => 'observable');
const mockFetch = jest.fn(() => Promise.resolve([]));
const mockFind = jest.fn();
const mockFindAndObserve = jest.fn(() => 'findAndObservable');
const mockCreate = jest.fn((fn: any) => {
    const rec: any = {
        customer: { set: jest.fn() },
        bill: { set: jest.fn() },
        product: { set: jest.fn() },
    };
    fn(rec);
    return rec;
});

jest.mock('@core/database', () => ({
    database: {
        get: jest.fn(() => ({
            query: jest.fn(() => ({
                observe: (...a: any[]) => mockObserve(...a),
                fetch: (...a: any[]) => mockFetch(...a),
            })),
            find: (...a: any[]) => mockFind(...a),
            findAndObserve: (...a: any[]) => mockFindAndObserve(...a),
            create: (...a: any[]) => mockCreate(...a),
        })),
        write: jest.fn((fn: any) => fn()),
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
        asc: 'asc',
        like: jest.fn(),
        sanitizeLikeString: jest.fn((s: string) => s),
        or: jest.fn(),
        oneOf: jest.fn(),
        column: jest.fn(),
    },
}));

jest.mock('@shared/utils/id', () => ({
    generateBillNumber: jest.fn(() => 'INV-001'),
    generateId: jest.fn(() => 'id-1'),
}));

jest.mock('@core/constants', () => ({
    BILL_STATUSES: { COMPLETED: 'completed', CANCELLED: 'cancelled', PENDING: 'pending' },
    PAYMENT_MODES: { CASH: 'cash', UPI: 'upi', CREDIT: 'credit' },
    CREDIT_ENTRY_TYPES: { CREDIT: 'credit', PAYMENT: 'payment' },
}));

import { billRepository } from '@features/billing/repositories/billRepository';

describe('billRepository', () => {
    const mockProduct = {
        id: 'p1',
        currentStock: 50,
        update: jest.fn((fn: any) => fn(mockProduct)),
    };
    const mockBill: any = {
        id: 'b1',
        billNumber: 'INV-001',
        subtotal: 100,
        grandTotal: 90,
        status: 'completed',
        update: jest.fn((fn: any) => fn(mockBill)),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockFind.mockResolvedValue(mockProduct);
        mockFetch.mockResolvedValue([]);
    });

    it('should observe all bills', () => {
        const result = billRepository.observeAll();
        expect(result).toBe('observable');
    });

    it('should observe bills by date range', () => {
        const result = billRepository.observeByDate(1000, 2000);
        expect(result).toBe('observable');
    });

    it('should find bill by id', () => {
        mockFind.mockResolvedValue(mockBill);
        billRepository.getById('b1');
        expect(mockFind).toHaveBeenCalledWith('b1');
    });

    it('should observe bill by id', () => {
        billRepository.observeById('b1');
        expect(mockFindAndObserve).toHaveBeenCalledWith('b1');
    });

    it('should get bill items', () => {
        const result = billRepository.getBillItems('b1');
        expect(result).toBe('observable');
    });

    it('should create a bill with items (cash)', async () => {
        const cartItems = [
            { productId: 'p1', productName: 'Rice', quantity: 2, unitPrice: 50, discount: 0, total: 100 },
        ];
        mockFind.mockResolvedValue({ ...mockProduct, update: jest.fn((fn: any) => fn(mockProduct)) });

        await billRepository.createBill(cartItems, 'cash', null, 10, 100, 90);
        const { database } = require('@core/database');
        expect(database.write).toHaveBeenCalled();
        expect(mockCreate).toHaveBeenCalled();
    });

    it('should create bill with credit payment for customer', async () => {
        const cartItems = [
            { productId: 'p1', productName: 'Rice', quantity: 1, unitPrice: 50, discount: 0, total: 50 },
        ];
        mockFind.mockResolvedValue({
            ...mockProduct,
            update: jest.fn((fn: any) => fn(mockProduct)),
        });
        mockFetch.mockResolvedValue([{ balanceAfter: 500 }]);

        await billRepository.createBill(cartItems, 'credit', 'c1', 0, 50, 50);
        const { database } = require('@core/database');
        expect(database.write).toHaveBeenCalled();
    });

    it('should cancel a bill and restore stock', async () => {
        mockFind.mockImplementation((id: string) => {
            if (id === 'b1') return Promise.resolve({ ...mockBill, update: jest.fn((fn: any) => fn(mockBill)) });
            return Promise.resolve({ ...mockProduct, update: jest.fn((fn: any) => fn(mockProduct)) });
        });
        mockFetch.mockResolvedValue([{ productId: 'p1', quantity: 2 }]);

        await billRepository.cancelBill('b1');
        const { database } = require('@core/database');
        expect(database.write).toHaveBeenCalled();
    });

    it('should get recent bills', () => {
        const result = billRepository.getRecentBills(5);
        expect(result).toBe('observable');
    });

    it('should search by bill number', () => {
        const result = billRepository.searchByBillNumber('INV');
        expect(result).toBe('observable');
    });
});
