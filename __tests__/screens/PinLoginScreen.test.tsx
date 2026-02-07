import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@shared/components/Logo', () => ({
    Logo: () => {
        const { View } = require('react-native');
        return <View testID="logo" />;
    },
}));
jest.mock('@features/auth/store/useAuthStore', () => ({
    useAuthStore: jest.fn(() => ({
        verifyAndLogin: jest.fn().mockReturnValue(false),
    })),
}));

import { PinLoginScreen } from '@features/auth/screens/PinLoginScreen';

describe('PinLoginScreen', () => {
    it('should render', () => {
        render(<PinLoginScreen />);
    });
});
