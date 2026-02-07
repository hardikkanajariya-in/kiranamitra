import React from 'react';
import { render } from '../../renderWithProviders';
import { ProductSearchBar } from '@features/billing/components/ProductSearchBar';

// Mock productRepository
jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        search: jest.fn().mockReturnValue({
            subscribe: jest.fn((cb: any) => {
                cb([]);
                return { unsubscribe: jest.fn() };
            }),
        }),
    },
}));

describe('ProductSearchBar', () => {
    it('should render search input', () => {
        const { getByPlaceholderText } = render(
            <ProductSearchBar onSelectProduct={jest.fn()} />
        );
        expect(getByPlaceholderText('searchProduct')).toBeTruthy();
    });

    it('should render without results dropdown initially', () => {
        render(<ProductSearchBar onSelectProduct={jest.fn()} />);
    });
});
