/**
 * Tests for productRepository
 */

const mockObserve = jest.fn(() => 'observable');
const mockFetch = jest.fn(() => Promise.resolve([]));
const mockFind = jest.fn();
const mockFindAndObserve = jest.fn(() => 'findAndObservable');
const mockCreate = jest.fn((fn: any) => {
    const rec: any = {
        name: '',
        category: { set: jest.fn() },
        product: { set: jest.fn() },
        purchasePrice: 0,
        sellingPrice: 0,
        currentStock: 0,
        lowStockThreshold: 0,
        unit: '',
        barcode: '',
        isActive: true,
        quantityChange: 0,
        reason: '',
        notes: '',
        icon: '',
    };
    fn(rec);
    return rec;
});

jest.mock('@core/database', () => ({
    database: {
        get: jest.fn(() => ({
            query: jest.fn(() => ({
                observe: (...a: any[]) => mockObserve(...a),
                fetch: (...a: any[]) => mockFetch(...a),
            })),
            find: (...a: any[]) => mockFind(...a),
            findAndObserve: (...a: any[]) => mockFindAndObserve(...a),
            create: (...a: any[]) => mockCreate(...a),
        })),
        write: jest.fn((fn: any) => fn()),
    },
}));

jest.mock('@nozbe/watermelondb', () => ({
    Q: {
        where: jest.fn(),
        gte: jest.fn(),
        lte: jest.fn(),
        sortBy: jest.fn(),
        take: jest.fn(),
        desc: 'desc',
        asc: 'asc',
        like: jest.fn(),
        sanitizeLikeString: jest.fn((s: string) => s),
        or: jest.fn(),
        column: jest.fn(),
    },
}));

import { productRepository } from '@features/products/repositories/productRepository';

describe('productRepository', () => {
    const mockProduct: any = {
        id: 'p1',
        name: 'Rice',
        currentStock: 50,
        isActive: true,
        update: jest.fn((fn: any) => { fn(mockProduct); return mockProduct; }),
        destroyPermanently: jest.fn(),
    };
    const mockCategory: any = {
        id: 'cat1',
        name: 'Grocery',
        update: jest.fn((fn: any) => { fn(mockCategory); return mockCategory; }),
        destroyPermanently: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockProduct.update = jest.fn((fn: any) => { fn(mockProduct); return mockProduct; });
        mockProduct.destroyPermanently = jest.fn();
        mockCategory.update = jest.fn((fn: any) => { fn(mockCategory); return mockCategory; });
        mockCategory.destroyPermanently = jest.fn();
        mockFind.mockResolvedValue(mockProduct);
    });

    // Product operations
    it('should observe all products', () => {
        expect(productRepository.observeAll()).toBe('observable');
    });

    it('should observe products by category', () => {
        expect(productRepository.observeByCategory('cat1')).toBe('observable');
    });

    it('should search products', () => {
        expect(productRepository.search('Rice')).toBe('observable');
    });

    it('should get product by id', async () => {
        const result = await productRepository.getById('p1');
        expect(mockFind).toHaveBeenCalledWith('p1');
    });

    it('should observe product by id', () => {
        expect(productRepository.observeById('p1')).toBe('findAndObservable');
    });

    it('should create a product without category', async () => {
        await productRepository.create({
            name: 'Sugar',
            purchasePrice: 40,
            sellingPrice: 55,
            currentStock: 100,
            lowStockThreshold: 20,
            unit: 'kg',
            barcode: '',
        });
        expect(mockCreate).toHaveBeenCalled();
    });

    it('should create a product with category', async () => {
        mockFind.mockResolvedValue(mockCategory);
        await productRepository.create({
            name: 'Sugar',
            categoryId: 'cat1',
            purchasePrice: 40,
            sellingPrice: 55,
            currentStock: 100,
            lowStockThreshold: 20,
            unit: 'kg',
            barcode: '123',
        });
        expect(mockCreate).toHaveBeenCalled();
    });

    it('should update a product', async () => {
        mockFind.mockResolvedValue({ ...mockProduct, update: jest.fn((fn: any) => { fn(mockProduct); return mockProduct; }) });
        await productRepository.update('p1', {
            name: 'Updated Rice',
            purchasePrice: 45,
            sellingPrice: 65,
            currentStock: 50,
            lowStockThreshold: 15,
            unit: 'kg',
            barcode: '',
        });
        expect(mockFind).toHaveBeenCalled();
    });

    it('should adjust stock and create inventory log', async () => {
        mockFind.mockResolvedValue({ ...mockProduct, update: jest.fn((fn: any) => { fn(mockProduct); return mockProduct; }) });
        await productRepository.adjustStock('p1', 10, 'purchase', 'New stock');
        expect(mockCreate).toHaveBeenCalled();
    });

    it('should deactivate a product', async () => {
        mockFind.mockResolvedValue({ ...mockProduct, update: jest.fn((fn: any) => { fn(mockProduct); return mockProduct; }) });
        await productRepository.deactivate('p1');
        expect(mockFind).toHaveBeenCalledWith('p1');
    });

    it('should get low stock products', () => {
        expect(productRepository.getLowStockProducts()).toBe('observable');
    });

    it('should get out of stock products', () => {
        expect(productRepository.getOutOfStockProducts()).toBe('observable');
    });

    // Category operations
    it('should observe categories', () => {
        expect(productRepository.observeCategories()).toBe('observable');
    });

    it('should create a category', async () => {
        await productRepository.createCategory({ name: 'Dairy', icon: 'cow' });
        expect(mockCreate).toHaveBeenCalled();
    });

    it('should update a category', async () => {
        mockFind.mockResolvedValue({ ...mockCategory, update: jest.fn((fn: any) => { fn(mockCategory); return mockCategory; }) });
        await productRepository.updateCategory('cat1', { name: 'Updated', icon: 'star' });
        expect(mockFind).toHaveBeenCalledWith('cat1');
    });

    it('should delete a category', async () => {
        mockFind.mockResolvedValue({ ...mockCategory, destroyPermanently: jest.fn() });
        await productRepository.deleteCategory('cat1');
        expect(mockFind).toHaveBeenCalledWith('cat1');
    });

    it('should get inventory logs', () => {
        expect(productRepository.getInventoryLogs('p1')).toBe('observable');
    });
});
