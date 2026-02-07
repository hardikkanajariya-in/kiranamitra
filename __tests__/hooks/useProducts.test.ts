/**
 * Tests for useProducts, useCategories, and useProductDetail hooks
 */
import { renderHook } from '@testing-library/react-native';

const mockUnsubscribe = jest.fn();
const mockProducts = [
    { id: 'p1', name: 'Rice', sellingPrice: 50 },
    { id: 'p2', name: 'Oil', sellingPrice: 120 },
];
const mockCategories = [
    { id: 'cat1', name: 'Grocery' },
    { id: 'cat2', name: 'Dairy' },
];

jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        observeAll: jest.fn(() => ({
            subscribe: (cb: any) => {
                cb(mockProducts);
                return { unsubscribe: mockUnsubscribe };
            },
        })),
        observeByCategory: jest.fn((catId: string) => ({
            subscribe: (cb: any) => {
                cb(mockProducts.slice(0, 1));
                return { unsubscribe: mockUnsubscribe };
            },
        })),
        search: jest.fn((query: string) => ({
            subscribe: (cb: any) => {
                cb([mockProducts[0]]);
                return { unsubscribe: mockUnsubscribe };
            },
        })),
        observeCategories: jest.fn(() => ({
            subscribe: (cb: any) => {
                cb(mockCategories);
                return { unsubscribe: mockUnsubscribe };
            },
        })),
        observeById: jest.fn((id: string) => ({
            subscribe: (cb: any) => {
                cb(mockProducts.find(p => p.id === id) || null);
                return { unsubscribe: mockUnsubscribe };
            },
        })),
    },
}));

jest.mock('@shared/hooks/useDebounce', () => ({
    useDebounce: jest.fn((value: any) => value),
}));

import { useProducts, useCategories, useProductDetail } from '@features/products/hooks/useProducts';

describe('useProducts', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return all products when no search query', () => {
        const { result } = renderHook(() => useProducts());
        expect(result.current.products).toHaveLength(2);
        expect(result.current.isLoading).toBe(false);
    });

    it('should search products when query is provided', () => {
        const { result } = renderHook(() => useProducts('Rice'));
        const { productRepository } = require('@features/products/repositories/productRepository');
        expect(productRepository.search).toHaveBeenCalledWith('Rice');
        expect(result.current.products).toHaveLength(1);
    });

    it('should filter by category when categoryId is provided', () => {
        renderHook(() => useProducts('', 'cat1'));
        const { productRepository } = require('@features/products/repositories/productRepository');
        expect(productRepository.observeByCategory).toHaveBeenCalledWith('cat1');
    });

    it('should unsubscribe on unmount', () => {
        const { unmount } = renderHook(() => useProducts());
        unmount();
        expect(mockUnsubscribe).toHaveBeenCalled();
    });
});

describe('useCategories', () => {
    it('should return categories', () => {
        const { result } = renderHook(() => useCategories());
        expect(result.current.categories).toHaveLength(2);
        expect(result.current.isLoading).toBe(false);
    });
});

describe('useProductDetail', () => {
    it('should return product detail by ID', () => {
        const { result } = renderHook(() => useProductDetail('p1'));
        expect(result.current.product?.name).toBe('Rice');
        expect(result.current.isLoading).toBe(false);
    });

    it('should call observeById with product ID', () => {
        renderHook(() => useProductDetail('p2'));
        const { productRepository } = require('@features/products/repositories/productRepository');
        expect(productRepository.observeById).toHaveBeenCalledWith('p2');
    });
});
