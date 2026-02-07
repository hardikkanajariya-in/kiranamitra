import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/products/hooks/useProducts', () => ({
    useProducts: jest.fn(),
    useProductDetail: jest.fn(() => ({
        product: {
            id: 'p1',
            name: 'Rice',
            currentStock: 50,
            unit: 'kg',
        },
        isLoading: false,
    })),
}));

jest.mock('@features/products/repositories/productRepository', () => ({
    productRepository: {
        adjustStock: jest.fn(),
    },
}));

jest.mock('@features/products/schemas/productSchema', () => ({
    stockAdjustmentSchema: {
        parse: jest.fn((data: any) => data),
    },
}));

jest.mock('@hookform/resolvers/zod', () => ({
    zodResolver: jest.fn(() => jest.fn()),
}));

jest.mock('react-hook-form', () => ({
    useForm: jest.fn(() => ({
        control: {},
        handleSubmit: jest.fn((fn: any) => fn),
        formState: { errors: {}, isSubmitting: false },
        reset: jest.fn(),
        setValue: jest.fn(),
        watch: jest.fn(),
    })),
    Controller: ({ render: renderProp }: any) => {
        const { View } = require('react-native');
        return renderProp ? renderProp({
            field: { value: '', onChange: jest.fn(), onBlur: jest.fn() },
            fieldState: { error: undefined },
        }) : <View />;
    },
}));

import { StockAdjustmentScreen } from '@features/products/screens/StockAdjustmentScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
const mockRoute = { params: { productId: 'p1' } };

describe('StockAdjustmentScreen', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should render stock adjustment screen', () => {
        render(<StockAdjustmentScreen navigation={mockNavigation} route={mockRoute} />);
    });

    it('should show loading when product data is loading', () => {
        const { useProductDetail } = require('@features/products/hooks/useProducts');
        useProductDetail.mockReturnValue({ product: null, isLoading: true });
        render(<StockAdjustmentScreen navigation={mockNavigation} route={mockRoute} />);
    });
});
