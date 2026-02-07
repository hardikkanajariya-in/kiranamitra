import React from 'react';
import { render, fireEvent } from '../../renderWithProviders';
import { CategoryFilter } from '@features/products/components/CategoryFilter';

describe('CategoryFilter', () => {
    const mockCategories = [
        { id: 'c1', name: 'Groceries', icon: 'cart' },
        { id: 'c2', name: 'Dairy', icon: 'cup' },
    ] as any[];
    const mockOnSelect = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    it('should render all categories chip', () => {
        const { getByText } = render(
            <CategoryFilter categories={mockCategories} onSelect={mockOnSelect} />
        );
        expect(getByText('allCategories')).toBeTruthy();
    });

    it('should render category names', () => {
        const { getByText } = render(
            <CategoryFilter categories={mockCategories} onSelect={mockOnSelect} />
        );
        expect(getByText('Groceries')).toBeTruthy();
        expect(getByText('Dairy')).toBeTruthy();
    });

    it('should call onSelect with undefined when all categories pressed', () => {
        const { getByText } = render(
            <CategoryFilter categories={mockCategories} selectedCategoryId="c1" onSelect={mockOnSelect} />
        );
        fireEvent.press(getByText('allCategories'));
        expect(mockOnSelect).toHaveBeenCalledWith(undefined);
    });

    it('should call onSelect with category id when category pressed', () => {
        const { getByText } = render(
            <CategoryFilter categories={mockCategories} onSelect={mockOnSelect} />
        );
        fireEvent.press(getByText('Groceries'));
        expect(mockOnSelect).toHaveBeenCalledWith('c1');
    });

    it('should deselect category when pressing already selected category', () => {
        const { getByText } = render(
            <CategoryFilter categories={mockCategories} selectedCategoryId="c1" onSelect={mockOnSelect} />
        );
        fireEvent.press(getByText('Groceries'));
        expect(mockOnSelect).toHaveBeenCalledWith(undefined);
    });

    it('should select different category', () => {
        const { getByText } = render(
            <CategoryFilter categories={mockCategories} selectedCategoryId="c1" onSelect={mockOnSelect} />
        );
        fireEvent.press(getByText('Dairy'));
        expect(mockOnSelect).toHaveBeenCalledWith('c2');
    });
});
