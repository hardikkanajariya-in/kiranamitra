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
        createPin: jest.fn(),
    })),
}));

import { PinCreateScreen } from '@features/auth/screens/PinCreateScreen';

describe('PinCreateScreen', () => {
    it('should render', () => {
        render(<PinCreateScreen />);
    });
});
