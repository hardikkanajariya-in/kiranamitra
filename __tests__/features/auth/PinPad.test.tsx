import React from 'react';
import { render, fireEvent } from '../../renderWithProviders';
import { PinPad } from '@features/auth/components/PinPad';

describe('PinPad', () => {
    it('should render keypad buttons 0-9', () => {
        const { getByText } = render(<PinPad onComplete={jest.fn()} />);
        for (let i = 0; i <= 9; i++) {
            expect(getByText(String(i))).toBeTruthy();
        }
    });

    it('should render clear button', () => {
        const { getByText } = render(<PinPad onComplete={jest.fn()} />);
        expect(getByText('auth:clear')).toBeTruthy();
    });

    it('should call onComplete when pin is complete', () => {
        jest.useFakeTimers();
        const onComplete = jest.fn();
        const { getByText } = render(<PinPad onComplete={onComplete} length={4} />);
        fireEvent.press(getByText('1'));
        fireEvent.press(getByText('2'));
        fireEvent.press(getByText('3'));
        fireEvent.press(getByText('4'));
        jest.advanceTimersByTime(200);
        expect(onComplete).toHaveBeenCalledWith('1234');
        jest.useRealTimers();
    });

    it('should render with default length', () => {
        render(<PinPad onComplete={jest.fn()} />);
    });

    it('should render with error state', () => {
        render(<PinPad onComplete={jest.fn()} error />);
    });
});
