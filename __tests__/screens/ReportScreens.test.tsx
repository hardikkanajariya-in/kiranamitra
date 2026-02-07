import React from 'react';
import { render, fireEvent, waitFor } from '../renderWithProviders';

const mockGetInventoryReport = jest.fn();
const mockGetProductPerformance = jest.fn();
const mockGetSalesReport = jest.fn();
const mockGetCreditReport = jest.fn();

jest.mock('@features/reports/services/reportService', () => ({
    reportService: {
        getSalesReport: (...a: any[]) => mockGetSalesReport(...a),
        getCreditReport: (...a: any[]) => mockGetCreditReport(...a),
        getInventoryReport: (...a: any[]) => mockGetInventoryReport(...a),
        getProductPerformance: (...a: any[]) => mockGetProductPerformance(...a),
    },
}));

jest.mock('@shopify/flash-list', () => ({
    FlashList: ({ data, renderItem }: any) => {
        const { View } = require('react-native');
        return <View>{data?.map((item: any, i: number) => renderItem({ item, index: i }))}</View>;
    },
}));

import { ReportsScreen } from '@features/reports/screens/ReportsScreen';
import { SalesReportScreen } from '@features/reports/screens/SalesReportScreen';
import { CreditReportScreen } from '@features/reports/screens/CreditReportScreen';
import { InventoryReportScreen } from '@features/reports/screens/InventoryReportScreen';
import { ProductPerformanceScreen } from '@features/reports/screens/ProductPerformanceScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

describe('Report Screens', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetSalesReport.mockResolvedValue({
            totalSales: 5000, totalBills: 10, averageBill: 500, dailyBreakdown: [],
        });
        mockGetCreditReport.mockResolvedValue({
            totalOutstanding: 2000, customers: [],
        });
        mockGetInventoryReport.mockResolvedValue({
            totalStockValue: 15000, lowStockCount: 3, outOfStockCount: 1,
            products: [
                { id: 'p1', name: 'Rice', currentStock: 5, unit: 'kg', stockValue: 250, isLowStock: true, isOutOfStock: false, lowStockThreshold: 10 },
                { id: 'p2', name: 'Oil', currentStock: 0, unit: 'L', stockValue: 0, isLowStock: false, isOutOfStock: true, lowStockThreshold: 5 },
                { id: 'p3', name: 'Sugar', currentStock: 50, unit: 'kg', stockValue: 2250, isLowStock: false, isOutOfStock: false, lowStockThreshold: 10 },
            ],
        });
        mockGetProductPerformance.mockResolvedValue([
            { id: 'p1', name: 'Rice', quantitySold: 100, revenue: 5000 },
            { id: 'p2', name: 'Oil', quantitySold: 50, revenue: 6000 },
        ]);
    });

    it('should render ReportsScreen with report options', () => {
        const { getByText } = render(<ReportsScreen navigation={mockNavigation} />);
        expect(getByText('title')).toBeTruthy();
        expect(getByText('salesReport')).toBeTruthy();
        expect(getByText('creditReport')).toBeTruthy();
        expect(getByText('inventoryReport')).toBeTruthy();
        expect(getByText('productPerformance')).toBeTruthy();
    });

    it('should render SalesReportScreen', () => {
        render(<SalesReportScreen navigation={mockNavigation} />);
    });

    it('should render CreditReportScreen', () => {
        render(<CreditReportScreen navigation={mockNavigation} />);
    });

    describe('InventoryReportScreen', () => {
        it('should render with inventory data', async () => {
            const { getByText } = render(<InventoryReportScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getByText('inventoryReport')).toBeTruthy();
            });
        });

        it('should show products when data is loaded', async () => {
            const { getByText } = render(<InventoryReportScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getByText('Rice')).toBeTruthy();
                expect(getByText('Oil')).toBeTruthy();
            });
        });

        it('should show stock value summary', async () => {
            const { getByText } = render(<InventoryReportScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getByText('totalStockValue')).toBeTruthy();
            });
        });

        it('should show out of stock chip for out of stock products', async () => {
            const { getAllByText } = render(<InventoryReportScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getAllByText('outOfStock').length).toBeGreaterThan(0);
            });
        });

        it('should show low stock chip for low stock products', async () => {
            const { getAllByText } = render(<InventoryReportScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getAllByText('lowStock').length).toBeGreaterThan(0);
            });
        });

        it('should render filter chips', async () => {
            const { getAllByText, getByText } = render(<InventoryReportScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getByText('Rice')).toBeTruthy();
            });
            expect(getAllByText('lowStock').length).toBeGreaterThan(0);
            expect(getAllByText('outOfStock').length).toBeGreaterThan(0);
            expect(getByText('all')).toBeTruthy();
        });
    });

    describe('ProductPerformanceScreen', () => {
        it('should render with product performance data', async () => {
            const { getByText } = render(<ProductPerformanceScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getByText('productPerformance')).toBeTruthy();
            });
        });

        it('should show product names and revenue', async () => {
            const { getByText } = render(<ProductPerformanceScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getByText('Rice')).toBeTruthy();
                expect(getByText('Oil')).toBeTruthy();
            });
        });

        it('should show total revenue summary', async () => {
            const { getByText } = render(<ProductPerformanceScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getByText('totalRevenue')).toBeTruthy();
                expect(getByText('totalProducts')).toBeTruthy();
            });
        });

        it('should show empty state when no data', async () => {
            mockGetProductPerformance.mockResolvedValue([]);
            const { getByText } = render(<ProductPerformanceScreen navigation={mockNavigation} />);
            await waitFor(() => {
                expect(getByText('noData')).toBeTruthy();
            });
        });
    });
});
