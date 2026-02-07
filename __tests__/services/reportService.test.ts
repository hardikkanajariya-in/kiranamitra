/**
 * Tests for reportService
 */

let mockBills: any[] = [];
let mockCustomers: any[] = [];
let mockProducts: any[] = [];
let mockCreditEntries: any[] = [];
let mockBillItems: any[] = [];

const getDataForTable = (tableName: string) => {
    switch (tableName) {
        case 'bills': return mockBills;
        case 'customers': return mockCustomers;
        case 'products': return mockProducts;
        case 'credit_entries': return mockCreditEntries;
        case 'bill_items': return mockBillItems;
        default: return [];
    }
};

// The reportService calls database.get() at module top level, so we need a stable
// collection mock whose query().fetch() dynamically reads current mock data
const createCollectionMock = (tableName: string) => ({
    query: jest.fn(() => ({
        fetch: jest.fn(() => Promise.resolve(getDataForTable(tableName))),
    })),
});

jest.mock('@core/database', () => ({
    database: {
        get: jest.fn((tableName: string) => createCollectionMock(tableName)),
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
        oneOf: jest.fn(),
    },
}));

jest.mock('@core/constants', () => ({
    BILL_STATUSES: { COMPLETED: 'completed', CANCELLED: 'cancelled', PENDING: 'pending' },
    STOCK_REASONS: { PURCHASE: 'purchase' },
    PAYMENT_MODES: { CASH: 'cash', UPI: 'upi', CREDIT: 'credit' },
}));

jest.mock('@shared/utils/date', () => ({
    formatDate: jest.fn((ts: number) => new Date(ts).toISOString().split('T')[0]),
    formatDateTime: jest.fn(() => '2025-01-01 10:00'),
}));

import { reportService } from '@features/reports/services/reportService';

describe('reportService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockBills.length = 0;
        mockCustomers.length = 0;
        mockProducts.length = 0;
        mockCreditEntries.length = 0;
        mockBillItems.length = 0;
    });

    describe('getSalesReport', () => {
        it('should return empty report when no bills', async () => {
            const result = await reportService.getSalesReport(new Date(), new Date());
            expect(result).toEqual({
                totalSales: 0,
                totalBills: 0,
                averageBill: 0,
                dailyBreakdown: [],
            });
        });

        it('should calculate totals from bills', async () => {
            mockBills.push(
                { id: 'b1', grandTotal: 100, paymentMode: 'cash', createdAt: Date.now() },
                { id: 'b2', grandTotal: 200, paymentMode: 'upi', createdAt: Date.now() },
            );
            const result = await reportService.getSalesReport(new Date(), new Date());
            expect(result.totalSales).toBe(300);
            expect(result.totalBills).toBe(2);
            expect(result.averageBill).toBe(150);
        });

        it('should group bills by day in dailyBreakdown', async () => {
            const day1 = new Date('2025-01-01').getTime();
            const day2 = new Date('2025-01-02').getTime();
            mockBills.push(
                { id: 'b1', grandTotal: 100, paymentMode: 'cash', createdAt: day1 },
                { id: 'b2', grandTotal: 50, paymentMode: 'cash', createdAt: day1 },
                { id: 'b3', grandTotal: 200, paymentMode: 'upi', createdAt: day2 },
            );
            const result = await reportService.getSalesReport(new Date(), new Date());
            expect(result.dailyBreakdown.length).toBe(2);
        });
    });

    describe('getCreditReport', () => {
        it('should return empty when no customers', async () => {
            const result = await reportService.getCreditReport();
            expect(result.totalOutstanding).toBe(0);
            expect(result.customers).toEqual([]);
        });

        it('should compute outstanding credit for customers', async () => {
            mockCustomers.push(
                { id: 'c1', name: 'Raj', phone: '9876543210' },
            );
            // Mock credit entries for this customer
            mockCreditEntries.push(
                { id: 'ce1', customerId: 'c1', balanceAfter: 500, createdAt: Date.now() },
            );

            const result = await reportService.getCreditReport();
            expect(result.totalOutstanding).toBe(500);
            expect(result.customers).toHaveLength(1);
            expect(result.customers[0].name).toBe('Raj');
        });
    });

    describe('getInventoryReport', () => {
        it('should return empty report when no products', async () => {
            const result = await reportService.getInventoryReport();
            expect(result.totalStockValue).toBe(0);
            expect(result.lowStockCount).toBe(0);
            expect(result.outOfStockCount).toBe(0);
            expect(result.products).toEqual([]);
        });

        it('should calculate stock values', async () => {
            mockProducts.push(
                { id: 'p1', name: 'Rice', currentStock: 100, unit: 'kg', purchasePrice: 40, sellingPrice: 60, isLowStock: false, isOutOfStock: false },
                { id: 'p2', name: 'Oil', currentStock: 0, unit: 'L', purchasePrice: 100, sellingPrice: 150, isLowStock: false, isOutOfStock: true },
            );
            const result = await reportService.getInventoryReport();
            expect(result.totalStockValue).toBe(4000); // 100*40 + 0*100
            expect(result.outOfStockCount).toBe(1);
            expect(result.products).toHaveLength(2);
        });
    });

    describe('getProductPerformance', () => {
        it('should return empty array when no bills', async () => {
            const result = await reportService.getProductPerformance(new Date(), new Date());
            expect(result).toEqual([]);
        });

        it('should calculate product performance from bill items', async () => {
            mockBills.push({ id: 'b1' });
            mockBillItems.push(
                { id: 'bi1', productId: 'p1', productName: 'Rice', quantity: 10, total: 500 },
                { id: 'bi2', productId: 'p1', productName: 'Rice', quantity: 5, total: 250 },
                { id: 'bi3', productId: 'p2', productName: 'Oil', quantity: 3, total: 450 },
            );
            const result = await reportService.getProductPerformance(new Date(), new Date());
            expect(result).toHaveLength(2);
            // Should be sorted by revenue descending
            expect(result[0].name).toBe('Rice');
            expect(result[0].quantitySold).toBe(15);
            expect(result[0].revenue).toBe(750);
            expect(result[1].name).toBe('Oil');
        });
    });
});
