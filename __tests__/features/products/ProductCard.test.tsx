import React from 'react';
import { render } from '../../renderWithProviders';
import { ProductCard } from '@features/products/components/ProductCard';

describe('ProductCard', () => {
    const defaultProps = {
        name: 'Rice 5kg',
        sellingPrice: 250,
        currentStock: 10,
        unit: 'kg',
        isLowStock: false,
        isOutOfStock: false,
        onPress: jest.fn(),
    };

    it('should render product name', () => {
        const { getByText } = render(<ProductCard {...defaultProps} />);
        expect(getByText('Rice 5kg')).toBeTruthy();
    });

    it('should render in-stock badge', () => {
        const { getByText } = render(<ProductCard {...defaultProps} />);
        expect(getByText('10 kg')).toBeTruthy();
    });

    it('should render low stock badge', () => {
        const { getByText } = render(
            <ProductCard {...defaultProps} isLowStock currentStock={2} />
        );
        expect(getByText('lowStock')).toBeTruthy();
    });

    it('should render out of stock badge', () => {
        const { getByText } = render(
            <ProductCard {...defaultProps} isOutOfStock currentStock={0} />
        );
        expect(getByText('outOfStock')).toBeTruthy();
    });
});
