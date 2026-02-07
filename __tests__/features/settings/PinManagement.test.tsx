import React from 'react';
import { render, fireEvent } from '../../renderWithProviders';
import { PinManagement } from '@features/settings/components/PinManagement';
import { Alert } from 'react-native';

const mockVerifyAndLogin = jest.fn().mockReturnValue(true);
const mockChangePin = jest.fn().mockReturnValue(true);

jest.mock('@features/auth/store/useAuthStore', () => ({
    useAuthStore: jest.fn(() => ({
        verifyAndLogin: mockVerifyAndLogin,
        changePin: mockChangePin,
    })),
}));

// Mock PinPad to capture onComplete callback
jest.mock('@features/auth/components/PinPad', () => ({
    PinPad: ({ onComplete }: { onComplete: (pin: string) => void }) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity testID="pin-pad" onPress={() => onComplete('1234')}>
                <Text>MockPinPad</Text>
            </TouchableOpacity>
        );
    },
}));

jest.spyOn(Alert, 'alert');

describe('PinManagement', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockVerifyAndLogin.mockReturnValue(true);
        mockChangePin.mockReturnValue(true);
    });

    it('should render pin management menu', () => {
        const { getByText } = render(<PinManagement />);
        expect(getByText('pinManagement')).toBeTruthy();
        expect(getByText('changePin')).toBeTruthy();
        expect(getByText('pinDesc')).toBeTruthy();
    });

    it('should show verifyOld step after pressing change pin', () => {
        const { getByText } = render(<PinManagement />);
        fireEvent.press(getByText('changePin'));
        expect(getByText('enterCurrentPin')).toBeTruthy();
        expect(getByText('MockPinPad')).toBeTruthy();
    });

    it('should move to enterNew step after verifying old pin', () => {
        const { getByText, getByTestId } = render(<PinManagement />);
        fireEvent.press(getByText('changePin'));
        fireEvent.press(getByTestId('pin-pad'));
        expect(getByText('enterNewPin')).toBeTruthy();
    });

    it('should show error when old pin is incorrect', () => {
        mockVerifyAndLogin.mockReturnValue(false);
        const { getByText, getByTestId } = render(<PinManagement />);
        fireEvent.press(getByText('changePin'));
        fireEvent.press(getByTestId('pin-pad'));
        expect(getByText('incorrectPin')).toBeTruthy();
    });

    it('should complete full pin change flow successfully', () => {
        const { getByText, getByTestId } = render(<PinManagement />);
        // Step 1: Press change pin
        fireEvent.press(getByText('changePin'));
        // Step 2: Verify old pin
        fireEvent.press(getByTestId('pin-pad'));
        // Step 3: Enter new pin
        fireEvent.press(getByTestId('pin-pad'));
        // Step 4: Confirm new pin (same pin '1234')
        fireEvent.press(getByTestId('pin-pad'));
        expect(mockChangePin).toHaveBeenCalledWith('1234', '1234');
        expect(Alert.alert).toHaveBeenCalledWith('pinChanged', 'pinChangedDesc');
    });

    it('should show error when changePin fails', () => {
        mockChangePin.mockReturnValue(false);
        const { getByText, getByTestId } = render(<PinManagement />);
        fireEvent.press(getByText('changePin'));
        fireEvent.press(getByTestId('pin-pad')); // verify old
        fireEvent.press(getByTestId('pin-pad')); // enter new
        fireEvent.press(getByTestId('pin-pad')); // confirm (same pin '1234', but changePin fails)
        expect(getByText('pinChangeError')).toBeTruthy();
    });

    it('should handle cancel button', () => {
        const { getByText } = render(<PinManagement />);
        fireEvent.press(getByText('changePin'));
        expect(getByText('enterCurrentPin')).toBeTruthy();
        fireEvent.press(getByText('cancel'));
        expect(getByText('pinManagement')).toBeTruthy();
    });
});
