import React from 'react';
import { render, fireEvent } from '../renderWithProviders';

const mockProducts = [
    { id: 'p1', name: 'Rice', sellingPrice: 50, currentStock: 5, lowStockThreshold: 10, unit: 'kg', isLowStock: true, isOutOfStock: false },
    { id: 'p2', name: 'Oil', sellingPrice: 120, currentStock: 0, lowStockThreshold: 5, unit: 'L', isLowStock: false, isOutOfStock: true },
    { id: 'p3', name: 'Sugar', sellingPrice: 45, currentStock: 50, lowStockThreshold: 10, unit: 'kg', isLowStock: false, isOutOfStock: false },
];

const mockUseProducts = jest.fn();

jest.mock('@features/products/hooks/useProducts', () => ({
    useProducts: (...a: any[]) => mockUseProducts(...a),
    useProductDetail: jest.fn(),
}));

jest.mock('@shopify/flash-list', () => ({
    FlashList: ({ data, renderItem }: any) => {
        const { View } = require('react-native');
        return <View>{data?.map((item: any, i: number) => renderItem({ item, index: i }))}</View>;
    },
}));

import { InventoryScreen } from '@features/inventory/screens/InventoryScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: {} };

describe('InventoryScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseProducts.mockReturnValue({ products: mockProducts, isLoading: false });
    });

    it('should render inventory screen with products', () => {
        const { getByText } = render(
            <InventoryScreen navigation={mockNavigation as any} route={mockRoute as any} />
        );
        expect(getByText('Rice')).toBeTruthy();
        expect(getByText('Oil')).toBeTruthy();
        expect(getByText('Sugar')).toBeTruthy();
    });

    it('should show loading when data is loading', () => {
        mockUseProducts.mockReturnValue({ products: [], isLoading: true });
        render(<InventoryScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    });

    it('should show filter chips with counts', () => {
        const { getByText } = render(
            <InventoryScreen navigation={mockNavigation as any} route={mockRoute as any} />
        );
        expect(getByText('all (3)')).toBeTruthy();
    });

    it('should filter to low stock products', () => {
        const { getByText, queryByText } = render(
            <InventoryScreen navigation={mockNavigation as any} route={mockRoute as any} />
        );
        fireEvent.press(getByText('lowStock (1)'));
        expect(getByText('Rice')).toBeTruthy();
        expect(queryByText('Sugar')).toBeNull();
        expect(queryByText('Oil')).toBeNull();
    });

    it('should filter to out of stock products', () => {
        const { getByText, queryByText } = render(
            <InventoryScreen navigation={mockNavigation as any} route={mockRoute as any} />
        );
        fireEvent.press(getByText('outOfStock (1)'));
        expect(getByText('Oil')).toBeTruthy();
        expect(queryByText('Rice')).toBeNull();
        expect(queryByText('Sugar')).toBeNull();
    });

    it('should show empty state when no products match', () => {
        mockUseProducts.mockReturnValue({ products: [], isLoading: false });
        const { getByText } = render(
            <InventoryScreen navigation={mockNavigation as any} route={mockRoute as any} />
        );
        expect(getByText('noItems')).toBeTruthy();
    });

    it('should navigate to product detail on press', () => {
        const { getByText } = render(
            <InventoryScreen navigation={mockNavigation as any} route={mockRoute as any} />
        );
        fireEvent.press(getByText('Rice'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('ProductDetail', { productId: 'p1' });
    });

    it('should render with filter route param', () => {
        render(
            <InventoryScreen navigation={mockNavigation as any} route={{ params: { filter: 'lowStock' } } as any} />
        );
    });
});
