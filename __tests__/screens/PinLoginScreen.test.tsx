import React from 'react';
import { render, fireEvent } from '../renderWithProviders';

const mockVerifyAndLogin = jest.fn().mockReturnValue(false);

jest.mock('@shared/components/Logo', () => ({
    Logo: () => {
        const { View } = require('react-native');
        return <View testID="logo" />;
    },
}));
jest.mock('@features/auth/store/useAuthStore', () => ({
    useAuthStore: jest.fn(() => ({
        verifyAndLogin: mockVerifyAndLogin,
    })),
}));
jest.mock('@features/auth/components/PinPad', () => ({
    PinPad: ({ onComplete, error, onErrorAnimationEnd }: any) => {
        const { TouchableOpacity, Text, View } = require('react-native');
        return (
            <View>
                <TouchableOpacity testID="mock-pin-pad" onPress={() => onComplete('1234')}>
                    <Text>PinPad</Text>
                </TouchableOpacity>
                {error && onErrorAnimationEnd && (
                    <TouchableOpacity testID="error-anim-end" onPress={onErrorAnimationEnd}>
                        <Text>ErrorEnd</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    },
}));

import { PinLoginScreen } from '@features/auth/screens/PinLoginScreen';

describe('PinLoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockVerifyAndLogin.mockReturnValue(false);
    });

    it('should render welcome text', () => {
        const { getByText } = render(<PinLoginScreen />);
        expect(getByText('welcomeBack')).toBeTruthy();
        expect(getByText('enterPin')).toBeTruthy();
    });

    it('should render logo', () => {
        const { getByTestId } = render(<PinLoginScreen />);
        expect(getByTestId('logo')).toBeTruthy();
    });

    it('should show error on wrong pin', () => {
        mockVerifyAndLogin.mockReturnValue(false);
        const { getByTestId, getByText } = render(<PinLoginScreen />);
        fireEvent.press(getByTestId('mock-pin-pad'));
        expect(getByText('wrongPin')).toBeTruthy();
    });

    it('should call verifyAndLogin on pin complete', () => {
        const { getByTestId } = render(<PinLoginScreen />);
        fireEvent.press(getByTestId('mock-pin-pad'));
        expect(mockVerifyAndLogin).toHaveBeenCalledWith('1234');
    });

    it('should clear error after animation end', () => {
        mockVerifyAndLogin.mockReturnValue(false);
        const { getByTestId, queryByText } = render(<PinLoginScreen />);
        fireEvent.press(getByTestId('mock-pin-pad')); // triggers error
        fireEvent.press(getByTestId('error-anim-end')); // clears error
        expect(queryByText('wrongPin')).toBeNull();
    });

    it('should not show error when pin is correct', () => {
        mockVerifyAndLogin.mockReturnValue(true);
        const { getByTestId, queryByText } = render(<PinLoginScreen />);
        fireEvent.press(getByTestId('mock-pin-pad'));
        expect(queryByText('wrongPin')).toBeNull();
    });
});
