import { schema } from '@core/database/schema';

describe('database schema', () => {
    it('should have version 1', () => {
        expect(schema.version).toBe(1);
    });

    it('should have 8 tables', () => {
        expect(schema.tables).toBeDefined();
        const tableNames = Object.keys(schema.tables);
        expect(tableNames).toHaveLength(8);
    });

    it('should contain customers table', () => {
        const table = schema.tables.customers;
        expect(table).toBeDefined();
        expect(table.name).toBe('customers');
        const colNames = Object.keys(table.columns);
        expect(colNames).toContain('name');
        expect(colNames).toContain('phone');
        expect(colNames).toContain('is_active');
        expect(colNames).toContain('created_at');
        expect(colNames).toContain('updated_at');
    });

    it('should contain categories table', () => {
        const table = schema.tables.categories;
        expect(table).toBeDefined();
        const colNames = Object.keys(table.columns);
        expect(colNames).toContain('name');
        expect(colNames).toContain('icon');
    });

    it('should contain products table', () => {
        const table = schema.tables.products;
        expect(table).toBeDefined();
        const colNames = Object.keys(table.columns);
        expect(colNames).toContain('name');
        expect(colNames).toContain('category_id');
        expect(colNames).toContain('purchase_price');
        expect(colNames).toContain('selling_price');
        expect(colNames).toContain('current_stock');
        expect(colNames).toContain('low_stock_threshold');
        expect(colNames).toContain('barcode');
        expect(colNames).toContain('unit');
    });

    it('should contain bills table', () => {
        const table = schema.tables.bills;
        expect(table).toBeDefined();
        const colNames = Object.keys(table.columns);
        expect(colNames).toContain('bill_number');
        expect(colNames).toContain('grand_total');
        expect(colNames).toContain('payment_mode');
        expect(colNames).toContain('status');
    });

    it('should contain bill_items table', () => {
        const table = schema.tables.bill_items;
        expect(table).toBeDefined();
        const colNames = Object.keys(table.columns);
        expect(colNames).toContain('bill_id');
        expect(colNames).toContain('product_id');
        expect(colNames).toContain('quantity');
        expect(colNames).toContain('unit_price');
        expect(colNames).toContain('total');
    });

    it('should contain payments table', () => {
        const table = schema.tables.payments;
        expect(table).toBeDefined();
        const colNames = Object.keys(table.columns);
        expect(colNames).toContain('bill_id');
        expect(colNames).toContain('amount');
        expect(colNames).toContain('payment_mode');
    });

    it('should contain credit_entries table', () => {
        const table = schema.tables.credit_entries;
        expect(table).toBeDefined();
        const colNames = Object.keys(table.columns);
        expect(colNames).toContain('customer_id');
        expect(colNames).toContain('entry_type');
        expect(colNames).toContain('amount');
        expect(colNames).toContain('balance_after');
    });

    it('should contain inventory_logs table', () => {
        const table = schema.tables.inventory_logs;
        expect(table).toBeDefined();
        const colNames = Object.keys(table.columns);
        expect(colNames).toContain('product_id');
        expect(colNames).toContain('quantity_change');
        expect(colNames).toContain('reason');
    });

    it('should have indexed columns on customers', () => {
        const table = schema.tables.customers;
        expect(table.columns.name.isIndexed).toBe(true);
        expect(table.columns.phone.isIndexed).toBe(true);
    });

    it('should have indexed columns on products', () => {
        const table = schema.tables.products;
        expect(table.columns.name.isIndexed).toBe(true);
        expect(table.columns.category_id.isIndexed).toBe(true);
        expect(table.columns.barcode.isIndexed).toBe(true);
    });

    it('should have indexed columns on bills', () => {
        const table = schema.tables.bills;
        expect(table.columns.bill_number.isIndexed).toBe(true);
        expect(table.columns.customer_id.isIndexed).toBe(true);
    });
});
