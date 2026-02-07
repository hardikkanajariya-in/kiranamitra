import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/reports/services/reportService', () => ({
    reportService: {
        getSalesReport: jest.fn().mockResolvedValue({
            totalSales: 0,
            totalBills: 0,
            averageBill: 0,
            dailyBreakdown: [],
        }),
        getCreditReport: jest.fn().mockResolvedValue({
            totalOutstanding: 0,
            customers: [],
        }),
        getInventoryReport: jest.fn().mockResolvedValue({
            totalStockValue: 0,
            lowStockCount: 0,
            outOfStockCount: 0,
            products: [],
        }),
        getProductPerformance: jest.fn().mockResolvedValue([]),
    },
}));

import { ReportsScreen } from '@features/reports/screens/ReportsScreen';
import { SalesReportScreen } from '@features/reports/screens/SalesReportScreen';
import { CreditReportScreen } from '@features/reports/screens/CreditReportScreen';
import { InventoryReportScreen } from '@features/reports/screens/InventoryReportScreen';
import { ProductPerformanceScreen } from '@features/reports/screens/ProductPerformanceScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

describe('Report Screens', () => {
    it('should render ReportsScreen', () => {
        render(<ReportsScreen navigation={mockNavigation} />);
    });

    it('should render SalesReportScreen', () => {
        render(<SalesReportScreen navigation={mockNavigation} />);
    });

    it('should render CreditReportScreen', () => {
        render(<CreditReportScreen navigation={mockNavigation} />);
    });

    it('should render InventoryReportScreen', () => {
        render(<InventoryReportScreen navigation={mockNavigation} />);
    });

    it('should render ProductPerformanceScreen', () => {
        render(<ProductPerformanceScreen navigation={mockNavigation} />);
    });
});
