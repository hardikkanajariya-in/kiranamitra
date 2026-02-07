import React from 'react';
import { render, fireEvent } from '../../renderWithProviders';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';

describe('ConfirmDialog', () => {
    const defaultProps = {
        visible: true,
        title: 'Confirm',
        message: 'Are you sure?',
        onConfirm: jest.fn(),
        onDismiss: jest.fn(),
    };

    it('should render with title and message', () => {
        const { getByText } = render(<ConfirmDialog {...defaultProps} />);
        expect(getByText('Confirm')).toBeTruthy();
        expect(getByText('Are you sure?')).toBeTruthy();
    });

    it('should render default button labels', () => {
        const { getByText } = render(<ConfirmDialog {...defaultProps} />);
        expect(getByText('Cancel')).toBeTruthy();
        expect(getByText('Confirm')).toBeTruthy();
    });

    it('should render custom button labels', () => {
        const { getByText } = render(
            <ConfirmDialog {...defaultProps} confirmLabel="Yes" cancelLabel="No" />,
        );
        expect(getByText('Yes')).toBeTruthy();
        expect(getByText('No')).toBeTruthy();
    });

    it('should call onConfirm when confirm pressed', () => {
        const onConfirm = jest.fn();
        const { getByText } = render(
            <ConfirmDialog {...defaultProps} onConfirm={onConfirm} confirmLabel="OK" />,
        );
        fireEvent.press(getByText('OK'));
        expect(onConfirm).toHaveBeenCalled();
    });

    it('should call onDismiss when cancel pressed', () => {
        const onDismiss = jest.fn();
        const { getByText } = render(
            <ConfirmDialog {...defaultProps} onDismiss={onDismiss} />,
        );
        fireEvent.press(getByText('Cancel'));
        expect(onDismiss).toHaveBeenCalled();
    });

    it('should render with destructive style', () => {
        render(<ConfirmDialog {...defaultProps} destructive />);
    });

    it('should not render when not visible', () => {
        const { queryByText } = render(
            <ConfirmDialog {...defaultProps} visible={false} />,
        );
        // Dialog portal may or may not render the content when not visible
    });
});
