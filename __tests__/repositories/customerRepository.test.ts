/**
 * Tests for customerRepository
 */

const mockObserve = jest.fn(() => 'observable');
const mockFetch = jest.fn(() => Promise.resolve([]));
const mockFind = jest.fn();
const mockFindAndObserve = jest.fn(() => 'findAndObservable');
const mockCreate = jest.fn((fn: any) => {
    const rec: any = {
        name: '',
        phone: '',
        address: '',
        notes: '',
        isActive: true,
        customer: { set: jest.fn() },
        bill: { set: jest.fn() },
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
        sortBy: jest.fn(),
        take: jest.fn(),
        desc: 'desc',
        asc: 'asc',
        like: jest.fn(),
        sanitizeLikeString: jest.fn((s: string) => s),
        or: jest.fn(),
    },
}));

jest.mock('@core/constants', () => ({
    CREDIT_ENTRY_TYPES: { CREDIT: 'credit', PAYMENT: 'payment' },
}));

import { customerRepository } from '@features/customers/repositories/customerRepository';

describe('customerRepository', () => {
    const mockCustomer: any = {
        id: 'c1',
        name: 'Raj',
        phone: '9876543210',
        isActive: true,
        update: jest.fn((fn: any) => { fn(mockCustomer); return mockCustomer; }),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockCustomer.update = jest.fn((fn: any) => { fn(mockCustomer); return mockCustomer; });
        mockFind.mockResolvedValue(mockCustomer);
        mockFetch.mockResolvedValue([]);
    });

    it('should observe all customers', () => {
        expect(customerRepository.observeAll()).toBe('observable');
    });

    it('should observe customer by id', () => {
        expect(customerRepository.observeById('c1')).toBe('findAndObservable');
    });

    it('should search customers', () => {
        expect(customerRepository.search('Raj')).toBe('observable');
    });

    it('should get customer by id', async () => {
        const result = await customerRepository.getById('c1');
        expect(mockFind).toHaveBeenCalledWith('c1');
    });

    it('should create a customer', async () => {
        await customerRepository.create({
            name: 'New Customer',
            phone: '1234567890',
            address: '123 St',
            notes: '',
        });
        expect(mockCreate).toHaveBeenCalled();
    });

    it('should update a customer', async () => {
        await customerRepository.update('c1', {
            name: 'Updated Name',
            phone: '0000000000',
            address: '',
            notes: '',
        });
        expect(mockFind).toHaveBeenCalledWith('c1');
        expect(mockCustomer.update).toHaveBeenCalled();
    });

    it('should deactivate a customer', async () => {
        await customerRepository.deactivate('c1');
        expect(mockFind).toHaveBeenCalledWith('c1');
        expect(mockCustomer.update).toHaveBeenCalled();
    });

    it('should observe customers with credit', () => {
        expect(customerRepository.getCustomersWithCredit()).toBe('observable');
    });

    it('should observe credit entries for customer', () => {
        expect(customerRepository.getCreditEntries('c1')).toBe('observable');
    });

    it('should add credit payment', async () => {
        mockFetch.mockResolvedValue([{ balanceAfter: 1000 }]);
        await customerRepository.addCreditPayment('c1', 500, 'Test payment');
        expect(mockCreate).toHaveBeenCalled();
    });

    it('should add credit payment when no previous entries', async () => {
        mockFetch.mockResolvedValue([]);
        await customerRepository.addCreditPayment('c1', 200);
        expect(mockCreate).toHaveBeenCalled();
    });

    it('should get outstanding credit', async () => {
        mockFetch.mockResolvedValue([{ balanceAfter: 750 }]);
        const result = await customerRepository.getOutstandingCredit('c1');
        expect(result).toBe(750);
    });

    it('should return 0 outstanding credit when no entries', async () => {
        mockFetch.mockResolvedValue([]);
        const result = await customerRepository.getOutstandingCredit('c1');
        expect(result).toBe(0);
    });
});
