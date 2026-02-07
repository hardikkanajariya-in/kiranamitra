import React from 'react';
import { render } from '../../renderWithProviders';
import { CategoryFilter } from '@features/products/components/CategoryFilter';

describe('CategoryFilter', () => {
    const mockCategories = [
        { id: 'c1', name: 'Groceries', icon: 'cart' },
        { id: 'c2', name: 'Dairy', icon: 'cup' },
    ] as any[];

    it('should render all categories chip', () => {
        const { getByText } = render(
            <CategoryFilter categories={mockCategories} onSelect={jest.fn()} />
        );
        expect(getByText('allCategories')).toBeTruthy();
    });

    it('should render category names', () => {
        const { getByText } = render(
            <CategoryFilter categories={mockCategories} onSelect={jest.fn()} />
        );
        expect(getByText('Groceries')).toBeTruthy();
        expect(getByText('Dairy')).toBeTruthy();
    });

    it('should render with selected category', () => {
        render(
            <CategoryFilter categories={mockCategories} selectedCategoryId="c1" onSelect={jest.fn()} />
        );
    });
});
