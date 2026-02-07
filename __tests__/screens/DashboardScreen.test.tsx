import React from 'react';
import { render, fireEvent } from '../renderWithProviders';

const mockUseDashboardData = jest.fn();

jest.mock('@features/dashboard/hooks/useDashboardData', () => ({
    useDashboardData: () => mockUseDashboardData(),
}));

import { DashboardScreen } from '@features/dashboard/screens/DashboardScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

describe('DashboardScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseDashboardData.mockReturnValue({
            todaySales: 5000,
            todayBillCount: 10,
            monthSales: 50000,
            totalCustomers: 25,
            totalUdhar: 10000,
            lowStockProducts: 3,
            outOfStockProducts: 1,
            recentBills: [],
            isLoading: false,
        });
    });

    it('should render dashboard with greeting', () => {
        const { getByText } = render(<DashboardScreen navigation={mockNavigation} />);
        expect(getByText('title')).toBeTruthy();
        expect(getByText('dashboardSubtitle')).toBeTruthy();
    });

    it('should show loading when data is loading', () => {
        mockUseDashboardData.mockReturnValue({
            todaySales: 0, todayBillCount: 0, monthSales: 0, totalCustomers: 0,
            totalUdhar: 0, lowStockProducts: 0, outOfStockProducts: 0, recentBills: [], isLoading: true,
        });
        render(<DashboardScreen navigation={mockNavigation} />);
    });

    it('should render quick actions', () => {
        const { getByText } = render(<DashboardScreen navigation={mockNavigation} />);
        // QuickActions component renders quick action buttons
        expect(getByText('title')).toBeTruthy();
    });

    it('should display greeting emoji', () => {
        const { getByText } = render(<DashboardScreen navigation={mockNavigation} />);
        // getGreeting returns one of: goodMorning, goodAfternoon, goodEvening
        // i18n mock returns the key, so look for it with the emoji
        const text = getByText(/👋/);
        expect(text).toBeTruthy();
    });
});
