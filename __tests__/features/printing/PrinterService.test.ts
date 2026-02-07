import type { PrinterService, PrintBillData, PrintBillItem } from '@features/printing/services/PrinterService';

describe('PrinterService interface', () => {
    it('should define the PrintBillData type', () => {
        const data: PrintBillData = {
            storeName: 'Test Store',
            storeAddress: '123 Street',
            storePhone: '9876543210',
            billNumber: 'KM-240115-0001',
            date: '15/01/2024',
            time: '02:30 PM',
            items: [],
            subtotal: 100,
            discount: 0,
            grandTotal: 100,
            paymentMode: 'cash',
        };
        expect(data.storeName).toBe('Test Store');
        expect(data.billNumber).toContain('KM');
    });

    it('should support optional gstNumber', () => {
        const data: PrintBillData = {
            storeName: 'Test',
            storeAddress: '',
            storePhone: '',
            billNumber: 'KM-001',
            date: '01/01/2024',
            time: '10:00 AM',
            items: [],
            subtotal: 0,
            discount: 0,
            grandTotal: 0,
            paymentMode: 'cash',
            gstNumber: 'GST123',
        };
        expect(data.gstNumber).toBe('GST123');
    });

    it('should define PrintBillItem type', () => {
        const item: PrintBillItem = {
            name: 'Rice',
            quantity: 2,
            unit: 'kg',
            price: 50,
            total: 100,
        };
        expect(item.name).toBe('Rice');
        expect(item.total).toBe(100);
    });

    it('should support optional customer info', () => {
        const data: PrintBillData = {
            storeName: 'Test',
            storeAddress: '',
            storePhone: '',
            billNumber: 'KM-001',
            date: '01/01/2024',
            time: '10:00 AM',
            items: [],
            subtotal: 0,
            discount: 0,
            grandTotal: 0,
            paymentMode: 'cash',
            customerName: 'Rajesh',
            customerPhone: '9876543210',
        };
        expect(data.customerName).toBe('Rajesh');
    });
});
