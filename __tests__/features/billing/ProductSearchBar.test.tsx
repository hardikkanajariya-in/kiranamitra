import React from 'react';
import { render, fireEvent, act } from '../../renderWithProviders';
import { ProductSearchBar } from '@features/billing/components/ProductSearchBar';

const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        search: jest.fn().mockReturnValue({
            subscribe: (cb: any) => {
                mockSubscribe(cb);
                cb([
                    { id: 'p1', name: 'Rice', currentStock: 50, unit: 'kg', sellingPrice: 60 },
                    { id: 'p2', name: 'Dal', currentStock: 30, unit: 'kg', sellingPrice: 120 },
                ]);
                return { unsubscribe: mockUnsubscribe };
            },
        }),
    },
}));

describe('ProductSearchBar', () => {
    const mockOnSelectProduct = jest.fn();

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });
    afterEach(() => jest.useRealTimers());

    it('should render search input', () => {
        const { getByPlaceholderText } = render(
            <ProductSearchBar onSelectProduct={mockOnSelectProduct} />,
        );
        expect(getByPlaceholderText('searchProduct')).toBeTruthy();
    });

    it('should not show results for short query', () => {
        const { getByPlaceholderText, queryByText } = render(
            <ProductSearchBar onSelectProduct={mockOnSelectProduct} />,
        );
        fireEvent.changeText(getByPlaceholderText('searchProduct'), 'a');
        act(() => { jest.advanceTimersByTime(300); });
        expect(queryByText('Rice')).toBeNull();
    });

    it('should show dropdown results for query >= 2 chars', () => {
        const { getByPlaceholderText, getByText } = render(
            <ProductSearchBar onSelectProduct={mockOnSelectProduct} />,
        );
        fireEvent.changeText(getByPlaceholderText('searchProduct'), 'Ri');
        act(() => { jest.advanceTimersByTime(300); });
        expect(getByText('Rice')).toBeTruthy();
    });

    it('should call onSelectProduct when result is pressed', () => {
        const { getByPlaceholderText, getByText } = render(
            <ProductSearchBar onSelectProduct={mockOnSelectProduct} />,
        );
        fireEvent.changeText(getByPlaceholderText('searchProduct'), 'Ri');
        act(() => { jest.advanceTimersByTime(300); });
        fireEvent.press(getByText('Rice'));
        expect(mockOnSelectProduct).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'p1', name: 'Rice' }),
        );
    });

    it('should clear query and results on select', () => {
        const { getByPlaceholderText, getByText, queryByText } = render(
            <ProductSearchBar onSelectProduct={mockOnSelectProduct} />,
        );
        fireEvent.changeText(getByPlaceholderText('searchProduct'), 'Ri');
        act(() => { jest.advanceTimersByTime(300); });
        fireEvent.press(getByText('Rice'));
        expect(queryByText('Rice')).toBeNull();
    });

    it('should clear results when query becomes less than 2 chars', () => {
        const { getByPlaceholderText, getByText, queryByText } = render(
            <ProductSearchBar onSelectProduct={mockOnSelectProduct} />,
        );
        fireEvent.changeText(getByPlaceholderText('searchProduct'), 'Ri');
        act(() => { jest.advanceTimersByTime(300); });
        expect(getByText('Rice')).toBeTruthy();
        fireEvent.changeText(getByPlaceholderText('searchProduct'), '');
        expect(queryByText('Rice')).toBeNull();
    });
});
