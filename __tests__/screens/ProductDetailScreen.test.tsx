import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/products/hooks/useProducts', () => ({
    useProducts: jest.fn(),
    useProductDetail: jest.fn(() => ({
        product: {
            id: 'p1',
            name: 'Basmati Rice',
            sellingPrice: 80,
            purchasePrice: 60,
            currentStock: 50,
            lowStockThreshold: 10,
            unit: 'kg',
            barcode: '1234567890',
            isLowStock: false,
            isOutOfStock: false,
        },
        isLoading: false,
    })),
}));

jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        deactivate: jest.fn(),
        adjustStock: jest.fn(),
    },
}));

import { ProductDetailScreen } from '@features/products/screens/ProductDetailScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: { productId: 'p1' } };

describe('ProductDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const { useProductDetail } = require('@features/products/hooks/useProducts');
        useProductDetail.mockReturnValue({
            product: {
                id: 'p1',
                name: 'Basmati Rice',
                sellingPrice: 80,
                purchasePrice: 60,
                currentStock: 50,
                lowStockThreshold: 10,
                unit: 'kg',
                barcode: '1234567890',
                isLowStock: false,
                isOutOfStock: false,
            },
            isLoading: false,
        });
    });

    it('should render product detail with pricing info', () => {
        render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
    });

    it('should show loading when product data is loading', () => {
        const { useProductDetail } = require('@features/products/hooks/useProducts');
        useProductDetail.mockReturnValue({ product: null, isLoading: true });
        render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
    });

    it('should render stock section with adjust button', () => {
        const { getByText } = render(
            <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getByText('adjustStock')).toBeTruthy();
    });
});
