import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/dashboard/hooks/useDashboardData', () => ({
    useDashboardData: jest.fn(() => ({
        todaySales: 5000,
        todayBillCount: 10,
        monthSales: 50000,
        totalCustomers: 25,
        totalUdhar: 10000,
        lowStockProducts: 3,
        outOfStockProducts: 1,
        recentBills: [],
        isLoading: false,
    })),
}));

import { DashboardScreen } from '@features/dashboard/screens/DashboardScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

describe('DashboardScreen', () => {
    it('should render dashboard', () => {
        render(<DashboardScreen navigation={mockNavigation} />);
    });
});
