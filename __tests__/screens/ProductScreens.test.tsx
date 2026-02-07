import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/products/hooks/useProducts', () => ({
    useProducts: jest.fn(() => ({
        products: [],
        isLoading: false,
    })),
    useCategories: jest.fn(() => ({
        categories: [],
        isLoading: false,
    })),
    useProductDetail: jest.fn(() => ({
        product: null,
        isLoading: false,
    })),
}));
jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        create: jest.fn(),
        update: jest.fn(),
        adjustStock: jest.fn(),
        deactivate: jest.fn(),
        observeAll: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        observeByCategory: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        search: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        observeById: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getById: jest.fn(),
        observeCategories: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getLowStockProducts: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getOutOfStockProducts: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
        getInventoryLogs: jest.fn().mockReturnValue({ subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })) }),
    },
}));

import { ProductListScreen } from '@features/products/screens/ProductListScreen';
import { ProductFormScreen } from '@features/products/screens/ProductFormScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

describe('Product Screens', () => {
    it('should render ProductListScreen', () => {
        render(<ProductListScreen navigation={mockNavigation} />);
    });

    it('should render ProductFormScreen in create mode', () => {
        const route = { params: {} };
        render(<ProductFormScreen navigation={mockNavigation} route={route} />);
    });
});
