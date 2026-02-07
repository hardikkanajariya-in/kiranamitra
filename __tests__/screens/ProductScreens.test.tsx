import React from 'react';
import { render, fireEvent } from '../renderWithProviders';

const mockUseProducts = jest.fn();
const mockUseCategories = jest.fn();
const mockGetById = jest.fn();

jest.mock('@features/products/hooks/useProducts', () => ({
    useProducts: (...args: any[]) => mockUseProducts(...args),
    useCategories: (...args: any[]) => mockUseCategories(...args),
    useProductDetail: jest.fn(() => ({
        product: null,
        isLoading: false,
    })),
}));
jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        create: jest.fn().mockResolvedValue({ id: 'new-p1' }),
        update: jest.fn().mockResolvedValue(undefined),
        adjustStock: jest.fn(),
        deactivate: jest.fn(),
        observeAll: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        observeByCategory: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        search: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        observeById: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getById: (...a: any[]) => mockGetById(...a),
        observeCategories: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getLowStockProducts: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getOutOfStockProducts: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getInventoryLogs: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
    },
}));

import { ProductListScreen } from '@features/products/screens/ProductListScreen';
import { ProductFormScreen } from '@features/products/screens/ProductFormScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

describe('ProductListScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseProducts.mockReturnValue({ products: [], isLoading: false });
        mockUseCategories.mockReturnValue({ categories: [], isLoading: false });
    });

    it('should render empty state when no products', () => {
        const { getByText } = render(<ProductListScreen navigation={mockNavigation} />);
        expect(getByText('noProducts')).toBeTruthy();
        expect(getByText('addProduct')).toBeTruthy();
    });

    it('should render product list with data', () => {
        mockUseProducts.mockReturnValue({
            products: [
                { id: 'p1', name: 'Rice', sellingPrice: 80, currentStock: 50, unit: 'kg', isLowStock: false, isOutOfStock: false },
                { id: 'p2', name: 'Sugar', sellingPrice: 45, currentStock: 5, unit: 'kg', isLowStock: true, isOutOfStock: false },
            ],
            isLoading: false,
        });
        const { getByText } = render(<ProductListScreen navigation={mockNavigation} />);
        expect(getByText('Rice')).toBeTruthy();
        expect(getByText('Sugar')).toBeTruthy();
    });

    it('should show loading overlay', () => {
        mockUseProducts.mockReturnValue({ products: [], isLoading: true });
        render(<ProductListScreen navigation={mockNavigation} />);
    });

    it('should navigate to add product', () => {
        const { getByText } = render(<ProductListScreen navigation={mockNavigation} />);
        fireEvent.press(getByText('addProduct'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('ProductForm');
    });

    it('should navigate to product detail on press', () => {
        mockUseProducts.mockReturnValue({
            products: [{ id: 'p1', name: 'Rice', sellingPrice: 80, currentStock: 50, unit: 'kg', isLowStock: false, isOutOfStock: false }],
            isLoading: false,
        });
        const { getByText } = render(<ProductListScreen navigation={mockNavigation} />);
        fireEvent.press(getByText('Rice'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('ProductDetail', { productId: 'p1' });
    });

    it('should render category filter', () => {
        mockUseCategories.mockReturnValue({
            categories: [{ id: 'cat1', name: 'Grains' }],
            isLoading: false,
        });
        const { getByText } = render(<ProductListScreen navigation={mockNavigation} />);
        expect(getByText('Grains')).toBeTruthy();
    });

    it('should render search input', () => {
        const { getByPlaceholderText } = render(<ProductListScreen navigation={mockNavigation} />);
        expect(getByPlaceholderText('searchPlaceholder')).toBeTruthy();
    });
});

describe('ProductFormScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseProducts.mockReturnValue({ products: [], isLoading: false });
        mockUseCategories.mockReturnValue({ categories: [], isLoading: false });
    });

    it('should render form in create mode', () => {
        const route = { params: {} };
        const { getByText } = render(<ProductFormScreen navigation={mockNavigation} route={route} />);
        expect(getByText('addProduct')).toBeTruthy();
        expect(getByText('save')).toBeTruthy();
    });

    it('should render all form fields', () => {
        const route = { params: {} };
        const { getAllByText } = render(<ProductFormScreen navigation={mockNavigation} route={route} />);
        expect(getAllByText('productName').length).toBeGreaterThan(0);
        expect(getAllByText('sellingPrice').length).toBeGreaterThan(0);
        expect(getAllByText('purchasePrice').length).toBeGreaterThan(0);
    });

    it('should render in edit mode', () => {
        mockGetById.mockResolvedValue({
            name: 'Existing Product', sellingPrice: 100, purchasePrice: 80,
            unit: 'kg', barcode: '', category: null, currentStock: 10, lowStockThreshold: 5,
        });
        const route = { params: { productId: 'p1' } };
        const { getByText } = render(<ProductFormScreen navigation={mockNavigation} route={route} />);
        expect(getByText('editProduct')).toBeTruthy();
        expect(getByText('update')).toBeTruthy();
    });
});
