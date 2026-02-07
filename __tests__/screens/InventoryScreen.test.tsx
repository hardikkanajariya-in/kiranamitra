import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/products/hooks/useProducts', () => ({
    useProducts: jest.fn(() => ({
        products: [
            {
                id: 'p1',
                name: 'Rice',
                sellingPrice: 50,
                currentStock: 5,
                lowStockThreshold: 10,
                unit: 'kg',
                isLowStock: true,
                isOutOfStock: false,
            },
            {
                id: 'p2',
                name: 'Oil',
                sellingPrice: 120,
                currentStock: 0,
                lowStockThreshold: 5,
                unit: 'L',
                isLowStock: false,
                isOutOfStock: true,
            },
            {
                id: 'p3',
                name: 'Sugar',
                sellingPrice: 45,
                currentStock: 50,
                lowStockThreshold: 10,
                unit: 'kg',
                isLowStock: false,
                isOutOfStock: false,
            },
        ],
        isLoading: false,
    })),
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
    beforeEach(() => jest.clearAllMocks());

    it('should render inventory screen with products', () => {
        const { getByText } = render(
            <InventoryScreen navigation={mockNavigation as any} route={mockRoute as any} />
        );
        expect(getByText('Rice')).toBeTruthy();
    });

    it('should show loading when data is loading', () => {
        const { useProducts } = require('@features/products/hooks/useProducts');
        useProducts.mockReturnValue({ products: [], isLoading: true });
        render(<InventoryScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    });

    it('should render with filter route param', () => {
        const { useProducts } = require('@features/products/hooks/useProducts');
        useProducts.mockReturnValue({
            products: [
                { id: 'p1', name: 'Rice', sellingPrice: 50, currentStock: 5, lowStockThreshold: 10, unit: 'kg', isLowStock: true, isOutOfStock: false },
            ],
            isLoading: false,
        });
        render(
            <InventoryScreen navigation={mockNavigation as any} route={{ params: { filter: 'lowStock' } } as any} />
        );
    });
});
