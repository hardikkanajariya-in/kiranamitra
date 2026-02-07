import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'customers',
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'phone', type: 'string', isIndexed: true },
        { name: 'address', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'products',
      columns: [
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'purchase_price', type: 'number' },
        { name: 'selling_price', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'barcode', type: 'string', isOptional: true, isIndexed: true },
        { name: 'low_stock_threshold', type: 'number' },
        { name: 'current_stock', type: 'number' },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'inventory_logs',
      columns: [
        { name: 'product_id', type: 'string', isIndexed: true },
        { name: 'quantity_change', type: 'number' },
        { name: 'reason', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'bills',
      columns: [
        { name: 'customer_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'bill_number', type: 'string', isIndexed: true },
        { name: 'subtotal', type: 'number' },
        { name: 'discount_total', type: 'number' },
        { name: 'tax_total', type: 'number' },
        { name: 'grand_total', type: 'number' },
        { name: 'payment_mode', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'bill_items',
      columns: [
        { name: 'bill_id', type: 'string', isIndexed: true },
        { name: 'product_id', type: 'string', isIndexed: true },
        { name: 'product_name', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'unit_price', type: 'number' },
        { name: 'discount', type: 'number' },
        { name: 'total', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'payments',
      columns: [
        { name: 'bill_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'customer_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'amount', type: 'number' },
        { name: 'payment_mode', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'credit_entries',
      columns: [
        { name: 'customer_id', type: 'string', isIndexed: true },
        { name: 'bill_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'entry_type', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'balance_after', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
