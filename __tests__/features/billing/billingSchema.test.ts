import { z } from 'zod';
import { billItemSchema, billSchema, BillItemFormData, BillFormData } from '@features/billing/schemas/billingSchema';

describe('billingSchema', () => {
    describe('billItemSchema', () => {
        it('should validate a correct bill item', () => {
            const data: BillItemFormData = {
                productId: 'p1',
                productName: 'Rice',
                quantity: 2,
                unitPrice: 50,
                discount: 0,
            };
            expect(billItemSchema.parse(data)).toEqual(data);
        });

        it('should reject empty productId', () => {
            expect(() => billItemSchema.parse({
                productId: '', productName: 'Rice', quantity: 2, unitPrice: 50, discount: 0,
            })).toThrow();
        });

        it('should reject zero quantity', () => {
            expect(() => billItemSchema.parse({
                productId: 'p1', productName: 'Rice', quantity: 0, unitPrice: 50, discount: 0,
            })).toThrow();
        });

        it('should reject negative price', () => {
            expect(() => billItemSchema.parse({
                productId: 'p1', productName: 'Rice', quantity: 1, unitPrice: -10, discount: 0,
            })).toThrow();
        });

        it('should default discount to 0', () => {
            const result = billItemSchema.parse({
                productId: 'p1', productName: 'Rice', quantity: 1, unitPrice: 50,
            });
            expect(result.discount).toBe(0);
        });
    });

    describe('billSchema', () => {
        it('should validate a correct bill', () => {
            const data: BillFormData = {
                paymentMode: 'cash',
                discountTotal: 0,
            };
            expect(billSchema.parse(data)).toBeDefined();
        });

        it('should accept optional customerId', () => {
            const data = { paymentMode: 'cash' as const, customerId: 'c1' };
            const result = billSchema.parse(data);
            expect(result.customerId).toBe('c1');
        });

        it('should accept upi payment mode', () => {
            expect(billSchema.parse({ paymentMode: 'upi' })).toBeDefined();
        });

        it('should accept card payment mode', () => {
            expect(billSchema.parse({ paymentMode: 'card' })).toBeDefined();
        });

        it('should accept credit payment mode', () => {
            expect(billSchema.parse({ paymentMode: 'credit' })).toBeDefined();
        });

        it('should reject invalid payment mode', () => {
            expect(() => billSchema.parse({ paymentMode: 'bitcoin' })).toThrow();
        });

        it('should default discountTotal to 0', () => {
            const result = billSchema.parse({ paymentMode: 'cash' });
            expect(result.discountTotal).toBe(0);
        });

        it('should accept optional notes', () => {
            const result = billSchema.parse({ paymentMode: 'cash', notes: 'test note' });
            expect(result.notes).toBe('test note');
        });
    });
});
