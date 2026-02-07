import { z } from 'zod';

export const billItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  productName: z.string(),
  quantity: z.number().min(0.01, 'Quantity must be positive'),
  unitPrice: z.number().min(0, 'Price cannot be negative'),
  discount: z.number().min(0).default(0),
});

export type BillItemFormData = z.infer<typeof billItemSchema>;

export const billSchema = z.object({
  customerId: z.string().optional(),
  paymentMode: z.enum(['cash', 'upi', 'card', 'credit']),
  discountTotal: z.number().min(0).default(0),
  notes: z.string().optional(),
});

export type BillFormData = z.infer<typeof billSchema>;
