import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/auth/screens/PinCreateScreen', () => ({
    PinCreateScreen: () => null,
}));
jest.mock('@features/auth/screens/PinLoginScreen', () => ({
    PinLoginScreen: () => null,
}));
jest.mock('@features/auth/store/useAuthStore', () => ({
    useAuthStore: jest.fn(() => ({
        isPinEnabled: false,
    })),
}));

import { AuthStack } from '../../src/navigation/AuthStack';

describe('AuthStack', () => {
    it('should render auth stack', () => {
        render(<AuthStack />);
    });
});
