import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  categoryId: z.string().optional().or(z.literal('')),
  purchasePrice: z
    .number()
    .min(0, 'Purchase price must be 0 or more')
    .default(0),
  sellingPrice: z
    .number()
    .min(0.01, 'Selling price is required')
    .default(0),
  currentStock: z
    .number()
    .min(0, 'Stock cannot be negative')
    .default(0),
  lowStockThreshold: z
    .number()
    .min(0, 'Threshold cannot be negative')
    .default(5),
  unit: z.string().default('pcs'),
  barcode: z.string().optional().or(z.literal('')),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  icon: z.string().default('tag'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const stockAdjustmentSchema = z.object({
  quantity: z
    .number()
    .min(1, 'Quantity must be at least 1'),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional().or(z.literal('')),
});

export type StockAdjustmentFormData = z.infer<typeof stockAdjustmentSchema>;
