import {
    productSchema,
    categorySchema,
    stockAdjustmentSchema,
    ProductFormData,
    CategoryFormData,
    StockAdjustmentFormData,
} from '@features/products/schemas/productSchema';

describe('productSchema', () => {
    describe('productSchema', () => {
        it('should validate a correct product', () => {
            const data: ProductFormData = {
                name: 'Basmati Rice',
                sellingPrice: 120,
                purchasePrice: 80,
                currentStock: 50,
                lowStockThreshold: 10,
                unit: 'kg',
            };
            expect(productSchema.parse(data)).toBeDefined();
        });

        it('should require name with min 2 characters', () => {
            expect(() => productSchema.parse({ name: 'A', sellingPrice: 10 })).toThrow();
        });

        it('should reject name over 100 characters', () => {
            expect(() => productSchema.parse({ name: 'A'.repeat(101), sellingPrice: 10 })).toThrow();
        });

        it('should require selling price > 0', () => {
            expect(() => productSchema.parse({ name: 'Rice', sellingPrice: 0 })).toThrow();
        });

        it('should allow purchase price = 0', () => {
            const result = productSchema.parse({ name: 'Rice', sellingPrice: 10, purchasePrice: 0 });
            expect(result.purchasePrice).toBe(0);
        });

        it('should reject negative purchase price', () => {
            expect(() => productSchema.parse({ name: 'Rice', sellingPrice: 10, purchasePrice: -5 })).toThrow();
        });

        it('should default currentStock to 0', () => {
            const result = productSchema.parse({ name: 'Rice', sellingPrice: 10 });
            expect(result.currentStock).toBe(0);
        });

        it('should default lowStockThreshold to 5', () => {
            const result = productSchema.parse({ name: 'Rice', sellingPrice: 10 });
            expect(result.lowStockThreshold).toBe(5);
        });

        it('should allow optional barcode', () => {
            const result = productSchema.parse({ name: 'Rice', sellingPrice: 10, barcode: '123456' });
            expect(result.barcode).toBe('123456');
        });

        it('should allow empty barcode', () => {
            const result = productSchema.parse({ name: 'Rice', sellingPrice: 10, barcode: '' });
            expect(result.barcode).toBe('');
        });

        it('should allow optional categoryId', () => {
            expect(productSchema.parse({ name: 'Rice', sellingPrice: 10, categoryId: 'c1' })).toBeDefined();
            expect(productSchema.parse({ name: 'Rice', sellingPrice: 10, categoryId: '' })).toBeDefined();
        });

        it('should reject negative stock', () => {
            expect(() => productSchema.parse({ name: 'Rice', sellingPrice: 10, currentStock: -1 })).toThrow();
        });
    });

    describe('categorySchema', () => {
        it('should validate a correct category', () => {
            const data: CategoryFormData = { name: 'Groceries', icon: 'cart' };
            expect(categorySchema.parse(data)).toBeDefined();
        });

        it('should require name with min 2 chars', () => {
            expect(() => categorySchema.parse({ name: 'A' })).toThrow();
        });

        it('should reject name over 50 chars', () => {
            expect(() => categorySchema.parse({ name: 'A'.repeat(51) })).toThrow();
        });

        it('should default icon to "tag"', () => {
            const result = categorySchema.parse({ name: 'Test' });
            expect(result.icon).toBe('tag');
        });
    });

    describe('stockAdjustmentSchema', () => {
        it('should validate a correct adjustment', () => {
            const data: StockAdjustmentFormData = { quantity: 10, reason: 'purchase' };
            expect(stockAdjustmentSchema.parse(data)).toBeDefined();
        });

        it('should require quantity >= 1', () => {
            expect(() => stockAdjustmentSchema.parse({ quantity: 0, reason: 'purchase' })).toThrow();
        });

        it('should require non-empty reason', () => {
            expect(() => stockAdjustmentSchema.parse({ quantity: 10, reason: '' })).toThrow();
        });

        it('should allow optional notes', () => {
            const result = stockAdjustmentSchema.parse({ quantity: 10, reason: 'purchase', notes: 'from vendor' });
            expect(result.notes).toBe('from vendor');
        });

        it('should allow empty notes', () => {
            const result = stockAdjustmentSchema.parse({ quantity: 10, reason: 'purchase', notes: '' });
            expect(result.notes).toBe('');
        });
    });
});
