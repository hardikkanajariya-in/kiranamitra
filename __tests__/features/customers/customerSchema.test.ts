import { customerSchema, CustomerFormData } from '@features/customers/schemas/customerSchema';

describe('customerSchema', () => {
    it('should validate a correct customer', () => {
        const data: CustomerFormData = { name: 'Rajesh Kumar', phone: '9876543210' };
        expect(customerSchema.parse(data)).toBeDefined();
    });

    it('should require name with min 2 characters', () => {
        expect(() => customerSchema.parse({ name: 'A' })).toThrow('Name must be at least 2 characters');
    });

    it('should reject name over 100 characters', () => {
        expect(() => customerSchema.parse({ name: 'A'.repeat(101) })).toThrow();
    });

    it('should validate Indian phone number', () => {
        expect(customerSchema.parse({ name: 'Test', phone: '9123456789' })).toBeDefined();
    });

    it('should reject invalid phone numbers', () => {
        expect(() => customerSchema.parse({ name: 'Test', phone: '1234567890' })).toThrow();
        expect(() => customerSchema.parse({ name: 'Test', phone: '12345' })).toThrow();
    });

    it('should allow empty phone', () => {
        expect(customerSchema.parse({ name: 'Test', phone: '' })).toBeDefined();
    });

    it('should allow optional phone', () => {
        expect(customerSchema.parse({ name: 'Test' })).toBeDefined();
    });

    it('should allow optional address', () => {
        expect(customerSchema.parse({ name: 'Test', address: '123 Street' })).toBeDefined();
        expect(customerSchema.parse({ name: 'Test', address: '' })).toBeDefined();
    });

    it('should reject address over 200 characters', () => {
        expect(() => customerSchema.parse({ name: 'Test', address: 'A'.repeat(201) })).toThrow();
    });

    it('should allow optional notes', () => {
        expect(customerSchema.parse({ name: 'Test', notes: 'VIP customer' })).toBeDefined();
        expect(customerSchema.parse({ name: 'Test', notes: '' })).toBeDefined();
    });

    it('should reject notes over 500 characters', () => {
        expect(() => customerSchema.parse({ name: 'Test', notes: 'A'.repeat(501) })).toThrow();
    });

    it('should accept all valid phone prefixes (6-9)', () => {
        expect(customerSchema.parse({ name: 'Test', phone: '6123456789' })).toBeDefined();
        expect(customerSchema.parse({ name: 'Test', phone: '7123456789' })).toBeDefined();
        expect(customerSchema.parse({ name: 'Test', phone: '8123456789' })).toBeDefined();
        expect(customerSchema.parse({ name: 'Test', phone: '9123456789' })).toBeDefined();
    });
});
