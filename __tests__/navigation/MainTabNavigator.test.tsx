import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('../../src/navigation/DashboardStack', () => ({
    DashboardStack: () => null,
}));
jest.mock('../../src/navigation/CustomerStack', () => ({
    CustomerStack: () => null,
}));
jest.mock('../../src/navigation/BillingStack', () => ({
    BillingStack: () => null,
}));
jest.mock('../../src/navigation/InventoryStack', () => ({
    InventoryStack: () => null,
}));
jest.mock('../../src/navigation/MoreStack', () => ({
    MoreStack: () => null,
}));

import { MainTabNavigator } from '../../src/navigation/MainTabNavigator';

describe('MainTabNavigator', () => {
    it('should render tab navigator', () => {
        render(<MainTabNavigator />);
    });
});
