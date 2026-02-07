import React from 'react';
import { render, fireEvent } from '../../renderWithProviders';
import { CartItemRow } from '@features/billing/components/CartItemRow';
import { createMockCartItem } from '../../factories';

describe('CartItemRow', () => {
    const mockOnUpdateQuantity = jest.fn();
    const mockOnRemove = jest.fn();
    const mockItem = createMockCartItem();

    const defaultProps = {
        item: mockItem,
        onUpdateQuantity: mockOnUpdateQuantity,
        onRemove: mockOnRemove,
    };

    beforeEach(() => jest.clearAllMocks());

    it('should render product name and quantity', () => {
        const { getByText } = render(<CartItemRow {...defaultProps} />);
        expect(getByText(mockItem.productName)).toBeTruthy();
        expect(getByText(String(mockItem.quantity))).toBeTruthy();
    });

    it('should call onUpdateQuantity with incremented value on plus press', () => {
        const { getAllByRole } = render(<CartItemRow {...defaultProps} />);
        // Find the plus button (second icon button)
        const buttons = getAllByRole('button');
        // The "plus" button
        const plusButton = buttons.find(b => {
            try { return b.props.accessibilityLabel || ''; } catch { return ''; }
        });
        // Just press the last-ish buttons by looking for the icon
        // Use a different approach - find all pressable elements
        // Press the plus icon
        fireEvent.press(buttons[1]); // plus is typically the second button
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith(mockItem.quantity + 1);
    });

    it('should call onUpdateQuantity with decremented value on minus press', () => {
        const item = { ...mockItem, quantity: 5 };
        const { getAllByRole } = render(
            <CartItemRow item={item} onUpdateQuantity={mockOnUpdateQuantity} onRemove={mockOnRemove} />,
        );
        const buttons = getAllByRole('button');
        fireEvent.press(buttons[0]); // minus is first button
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith(4);
    });

    it('should clamp quantity to minimum 0.5 on minus press', () => {
        const item = { ...mockItem, quantity: 0.5 };
        const { getAllByRole } = render(
            <CartItemRow item={item} onUpdateQuantity={mockOnUpdateQuantity} onRemove={mockOnRemove} />,
        );
        const buttons = getAllByRole('button');
        fireEvent.press(buttons[0]); // minus
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith(0.5);
    });

    it('should call onRemove when close button is pressed', () => {
        const { getAllByRole } = render(<CartItemRow {...defaultProps} />);
        const buttons = getAllByRole('button');
        fireEvent.press(buttons[2]); // close/remove is the third button
        expect(mockOnRemove).toHaveBeenCalled();
    });
});
