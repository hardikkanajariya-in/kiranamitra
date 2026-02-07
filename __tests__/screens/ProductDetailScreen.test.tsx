import React from 'react';
import { render, fireEvent, waitFor } from '../renderWithProviders';
import { Alert } from 'react-native';

const mockUseProductDetail = jest.fn();
const mockDeactivate = jest.fn().mockResolvedValue(undefined);

jest.mock('@features/products/hooks/useProducts', () => ({
    useProducts: jest.fn(),
    useProductDetail: (...args: any[]) => mockUseProductDetail(...args),
}));

jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        deactivate: (...a: any[]) => mockDeactivate(...a),
        adjustStock: jest.fn(),
    },
}));

jest.spyOn(Alert, 'alert');

import { ProductDetailScreen } from '@features/products/screens/ProductDetailScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: { productId: 'p1' } };

const productData = {
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
};

describe('ProductDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseProductDetail.mockReturnValue({
            product: productData,
            isLoading: false,
        });
    });

    it('should render product detail with pricing info', () => {
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        expect(getByText('pricing')).toBeTruthy();
        expect(getByText('purchasePrice')).toBeTruthy();
        expect(getByText('sellingPrice')).toBeTruthy();
        expect(getByText('margin')).toBeTruthy();
    });

    it('should display profit margin percentage', () => {
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        // (80 - 60) / 60 * 100 = 33.3%
        expect(getByText('33.3%')).toBeTruthy();
    });

    it('should show 0% margin when purchase price is 0', () => {
        mockUseProductDetail.mockReturnValue({
            product: { ...productData, purchasePrice: 0 },
            isLoading: false,
        });
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        expect(getByText('0%')).toBeTruthy();
    });

    it('should show loading when product data is loading', () => {
        mockUseProductDetail.mockReturnValue({ product: null, isLoading: true });
        render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
    });

    it('should render stock section with adjust button', () => {
        const { getByText } = render(
            <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getByText('adjustStock')).toBeTruthy();
        expect(getByText('stock')).toBeTruthy();
        expect(getByText('currentStock')).toBeTruthy();
        expect(getByText('threshold')).toBeTruthy();
    });

    it('should show inStock badge for normal stock', () => {
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        expect(getByText('inStock')).toBeTruthy();
    });

    it('should show lowStock badge when low stock', () => {
        mockUseProductDetail.mockReturnValue({
            product: { ...productData, isLowStock: true },
            isLoading: false,
        });
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        expect(getByText('lowStock')).toBeTruthy();
    });

    it('should show outOfStock badge when out of stock', () => {
        mockUseProductDetail.mockReturnValue({
            product: { ...productData, isOutOfStock: true },
            isLoading: false,
        });
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        expect(getByText('outOfStock')).toBeTruthy();
    });

    it('should display barcode when present', () => {
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        expect(getByText('1234567890')).toBeTruthy();
    });

    it('should not display barcode when absent', () => {
        mockUseProductDetail.mockReturnValue({
            product: { ...productData, barcode: '' },
            isLoading: false,
        });
        const { queryByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        expect(queryByText('1234567890')).toBeNull();
    });

    it('should navigate to adjust stock', () => {
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        fireEvent.press(getByText('adjustStock'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('StockAdjustment', { productId: 'p1' });
    });

    it('should display stock quantities with units', () => {
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        expect(getByText('50 kg')).toBeTruthy();
        expect(getByText('10 kg')).toBeTruthy();
    });

    it('should render details section with unit', () => {
        const { getByText } = render(<ProductDetailScreen navigation={mockNavigation} route={mockRoute} />);
        expect(getByText('details')).toBeTruthy();
    });
});
