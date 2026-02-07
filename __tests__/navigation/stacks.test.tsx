import React from 'react';
import { render } from '../renderWithProviders';

// These are simple wrapper navigators - mock the screens they import
jest.mock('@features/billing/screens/BillingScreen', () => ({
    BillingScreen: () => null,
}));
jest.mock('@features/billing/screens/BillPreviewScreen', () => ({
    BillPreviewScreen: () => null,
}));
jest.mock('@features/billing/screens/BillHistoryScreen', () => ({
    BillHistoryScreen: () => null,
}));
jest.mock('@features/customers/screens/CustomerListScreen', () => ({
    CustomerListScreen: () => null,
}));
jest.mock('@features/customers/screens/CustomerDetailScreen', () => ({
    CustomerDetailScreen: () => null,
}));
jest.mock('@features/customers/screens/CustomerFormScreen', () => ({
    CustomerFormScreen: () => null,
}));
jest.mock('@features/dashboard/screens/DashboardScreen', () => ({
    DashboardScreen: () => null,
}));
jest.mock('@features/products/screens/ProductListScreen', () => ({
    ProductListScreen: () => null,
}));
jest.mock('@features/products/screens/ProductDetailScreen', () => ({
    ProductDetailScreen: () => null,
}));
jest.mock('@features/products/screens/ProductFormScreen', () => ({
    ProductFormScreen: () => null,
}));
jest.mock('@features/products/screens/StockAdjustmentScreen', () => ({
    StockAdjustmentScreen: () => null,
}));
jest.mock('@features/inventory/screens/InventoryScreen', () => ({
    InventoryScreen: () => null,
}));
jest.mock('@features/reports/screens/ReportsScreen', () => ({
    ReportsScreen: () => null,
}));
jest.mock('@features/reports/screens/SalesReportScreen', () => ({
    SalesReportScreen: () => null,
}));
jest.mock('@features/reports/screens/CreditReportScreen', () => ({
    CreditReportScreen: () => null,
}));
jest.mock('@features/reports/screens/InventoryReportScreen', () => ({
    InventoryReportScreen: () => null,
}));
jest.mock('@features/reports/screens/ProductPerformanceScreen', () => ({
    ProductPerformanceScreen: () => null,
}));
jest.mock('@features/settings/screens/SettingsScreen', () => ({
    SettingsScreen: () => null,
}));
jest.mock('@features/auth/screens/PinCreateScreen', () => ({
    PinCreateScreen: () => null,
}));
jest.mock('@features/auth/screens/PinLoginScreen', () => ({
    PinLoginScreen: () => null,
}));
jest.mock('../../src/navigation/screens/MoreMenuScreen', () => ({
    MoreMenuScreen: () => null,
}));
jest.mock('@shared/components/LoadingOverlay', () => ({
    LoadingOverlay: () => null,
}));

import { BillingStack } from '../../src/navigation/BillingStack';
import { CustomerStack } from '../../src/navigation/CustomerStack';
import { DashboardStack } from '../../src/navigation/DashboardStack';
import { InventoryStack } from '../../src/navigation/InventoryStack';
import { MoreStack } from '../../src/navigation/MoreStack';

describe('Navigation Stacks', () => {
    it('should render BillingStack', () => {
        render(<BillingStack />);
    });

    it('should render CustomerStack', () => {
        render(<CustomerStack />);
    });

    it('should render DashboardStack', () => {
        render(<DashboardStack />);
    });

    it('should render InventoryStack', () => {
        render(<InventoryStack />);
    });

    it('should render MoreStack', () => {
        render(<MoreStack />);
    });
});
