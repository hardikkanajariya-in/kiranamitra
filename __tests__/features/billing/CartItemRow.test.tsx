import React from 'react';
import { render, fireEvent } from '../../renderWithProviders';
import { CartItemRow } from '@features/billing/components/CartItemRow';
import { createMockCartItem } from '../../factories';

describe('CartItemRow', () => {
    const mockItem = createMockCartItem();
    const defaultProps = {
        item: mockItem,
        onUpdateQuantity: jest.fn(),
        onRemove: jest.fn(),
    };

    it('should render product name', () => {
        const { getByText } = render(<CartItemRow {...defaultProps} />);
        expect(getByText(mockItem.productName)).toBeTruthy();
    });

    it('should render quantity', () => {
        const { getByText } = render(<CartItemRow {...defaultProps} />);
        expect(getByText(String(mockItem.quantity))).toBeTruthy();
    });

    it('should render with item details', () => {
        render(<CartItemRow {...defaultProps} />);
    });
});
