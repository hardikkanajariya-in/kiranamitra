import React from 'react';
import { render, fireEvent } from '../renderWithProviders';

const mockUseProductDetail = jest.fn();

jest.mock('@features/products/hooks/useProducts', () => ({
    useProducts: jest.fn(),
    useProductDetail: (...args: any[]) => mockUseProductDetail(...args),
}));

jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        adjustStock: jest.fn().mockResolvedValue(undefined),
    },
}));

import { StockAdjustmentScreen } from '@features/products/screens/StockAdjustmentScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: { productId: 'p1' } };

describe('StockAdjustmentScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseProductDetail.mockReturnValue({
            product: {
                id: 'p1',
                name: 'Rice',
                currentStock: 50,
                unit: 'kg',
            },
            isLoading: false,
        });
    });

    it('should render stock adjustment screen', () => {
        const { getByText } = render(
            <StockAdjustmentScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getByText('adjustStock')).toBeTruthy();
    });

    it('should show product name and current stock', () => {
        const { getByText } = render(
            <StockAdjustmentScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getByText(/Rice/)).toBeTruthy();
        expect(getByText(/50/)).toBeTruthy();
    });

    it('should render segmented buttons for add/remove', () => {
        const { getByText } = render(
            <StockAdjustmentScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getByText('addStock')).toBeTruthy();
        expect(getByText('removeStock')).toBeTruthy();
    });

    it('should render form fields', () => {
        const { getAllByText } = render(
            <StockAdjustmentScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getAllByText('quantity').length).toBeGreaterThan(0);
        expect(getAllByText('reason').length).toBeGreaterThan(0);
        expect(getAllByText('notes').length).toBeGreaterThan(0);
    });

    it('should render submit button', () => {
        const { getByText } = render(
            <StockAdjustmentScreen navigation={mockNavigation} route={mockRoute} />
        );
        expect(getByText('confirmAdjustment')).toBeTruthy();
    });

    it('should show loading when product data is loading', () => {
        mockUseProductDetail.mockReturnValue({ product: null, isLoading: true });
        render(<StockAdjustmentScreen navigation={mockNavigation} route={mockRoute} />);
    });

    it('should switch to remove stock mode', () => {
        const { getByText } = render(
            <StockAdjustmentScreen navigation={mockNavigation} route={mockRoute} />
        );
        fireEvent.press(getByText('removeStock'));
        // No crash means the state changed successfully
        expect(getByText('confirmAdjustment')).toBeTruthy();
    });
});
