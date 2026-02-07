import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('../../src/navigation/AuthStack', () => ({
    AuthStack: () => null,
}));
jest.mock('../../src/navigation/MainTabNavigator', () => ({
    MainTabNavigator: () => null,
}));
jest.mock('@shared/components/LoadingOverlay', () => ({
    LoadingOverlay: () => null,
}));
jest.mock('@features/auth/store/useAuthStore', () => ({
    useAuthStore: jest.fn(() => ({
        isAuthenticated: true,
        isPinEnabled: false,
        initializeAuth: jest.fn(),
    })),
}));

import { RootNavigator } from '../../src/navigation/RootNavigator';

describe('RootNavigator', () => {
    it('should render root navigator', () => {
        jest.useFakeTimers();
        render(<RootNavigator />);
        jest.advanceTimersByTime(200);
        jest.useRealTimers();
    });
});
