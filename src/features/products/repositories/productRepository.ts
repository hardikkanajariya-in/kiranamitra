import { database } from '@core/database';
import Product from '@core/database/models/Product';
import Category from '@core/database/models/Category';
import InventoryLog from '@core/database/models/InventoryLog';
import { Q } from '@nozbe/watermelondb';
import { ProductFormData, CategoryFormData } from '../schemas/productSchema';

const productsCollection = database.get<Product>('products');
const categoriesCollection = database.get<Category>('categories');
const inventoryLogsCollection = database.get<InventoryLog>('inventory_logs');

export const productRepository = {
    // Products
    observeAll: () =>
        productsCollection
            .query(Q.where('is_active', true), Q.sortBy('name', Q.asc))
            .observe(),

    observeByCategory: (categoryId: string) =>
        productsCollection
            .query(
                Q.where('is_active', true),
                Q.where('category_id', categoryId),
                Q.sortBy('name', Q.asc),
            )
            .observe(),

    search: (searchTerm: string) =>
        productsCollection
            .query(
                Q.where('is_active', true),
                Q.or(
                    Q.where('name', Q.like(`%${Q.sanitizeLikeString(searchTerm)}%`)),
                    Q.where('barcode', Q.like(`%${Q.sanitizeLikeString(searchTerm)}%`)),
                ),
                Q.sortBy('name', Q.asc),
            )
            .observe(),

    getById: (id: string) => productsCollection.find(id),

    observeById: (id: string) => productsCollection.findAndObserve(id),

    create: (data: ProductFormData) =>
        database.write(async () => {
            const category = data.categoryId
                ? await categoriesCollection.find(data.categoryId)
                : null;

            return productsCollection.create((product: Product) => {
                product.name = data.name;
                if (category) {
                    product.category.set(category);
                }
                product.purchasePrice = data.purchasePrice;
                product.sellingPrice = data.sellingPrice;
                product.currentStock = data.currentStock;
                product.lowStockThreshold = data.lowStockThreshold;
                product.unit = data.unit;
                product.barcode = data.barcode || '';
                product.isActive = true;
            });
        }),

    update: (id: string, data: ProductFormData) =>
        database.write(async () => {
            const product = await productsCollection.find(id);
            const category = data.categoryId
                ? await categoriesCollection.find(data.categoryId)
                : null;

            return product.update((p: Product) => {
                p.name = data.name;
                if (category) {
                    p.category.set(category);
                }
                p.purchasePrice = data.purchasePrice;
                p.sellingPrice = data.sellingPrice;
                p.lowStockThreshold = data.lowStockThreshold;
                p.unit = data.unit;
                p.barcode = data.barcode || '';
            });
        }),

    adjustStock: (
        productId: string,
        quantityChange: number,
        reason: string,
        notes: string = '',
    ) =>
        database.write(async () => {
            const product = await productsCollection.find(productId);

            // Update product stock
            await product.update((p: Product) => {
                p.currentStock = Math.max(0, p.currentStock + quantityChange);
            });

            // Create inventory log
            return inventoryLogsCollection.create((log: InventoryLog) => {
                log.product.set(product);
                log.quantityChange = quantityChange;
                log.reason = reason;
                log.notes = notes;
            });
        }),

    deactivate: async (id: string) => {
        const product = await productsCollection.find(id);
        // eslint-disable-next-line require-await
        return database.write(async () =>
            product.update((p: Product) => {
                p.isActive = false;
            }),
        );
    },

    getLowStockProducts: () =>
        productsCollection
            .query(
                Q.where('is_active', true),
                Q.where('current_stock', Q.lte(Q.column('low_stock_threshold'))),
                Q.sortBy('current_stock', Q.asc),
            )
            .observe(),

    getOutOfStockProducts: () =>
        productsCollection
            .query(
                Q.where('is_active', true),
                Q.where('current_stock', Q.lte(0)),
            )
            .observe(),

    // Categories
    observeCategories: () =>
        categoriesCollection
            .query(Q.sortBy('name', Q.asc))
            .observe(),

    createCategory: (data: CategoryFormData) =>
        // eslint-disable-next-line require-await
        database.write(async () =>
            categoriesCollection.create((category: Category) => {
                category.name = data.name;
                category.icon = data.icon;
            }),
        ),

    updateCategory: async (id: string, data: CategoryFormData) => {
        const category = await categoriesCollection.find(id);
        // eslint-disable-next-line require-await
        return database.write(async () =>
            category.update((c: Category) => {
                c.name = data.name;
                c.icon = data.icon;
            }),
        );
    },

    deleteCategory: async (id: string) => {
        const category = await categoriesCollection.find(id);
        // eslint-disable-next-line require-await
        return database.write(async () => category.destroyPermanently());
    },

    // Inventory Logs
    getInventoryLogs: (productId: string) =>
        inventoryLogsCollection
            .query(
                Q.where('product_id', productId),
                Q.sortBy('created_at', Q.desc),
            )
            .observe(),
};
