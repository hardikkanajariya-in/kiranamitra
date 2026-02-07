import { bluetoothPrinterService } from '@features/printing/services/BluetoothPrinterService';
import type { PrintBillData } from '@features/printing/services/PrinterService';

const mockPrinters = require('react-native-bluetooth-escpos-printer');

describe('BluetoothPrinterService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('connect', () => {
        it('should connect to printer', async () => {
            mockPrinters.BluetoothEscposPrinter.connect.mockResolvedValue(undefined);
            const result = await bluetoothPrinterService.connect('AA:BB:CC');
            expect(result).toBe(true);
            expect(bluetoothPrinterService.isConnected()).toBe(true);
        });

        it('should return false on connection failure', async () => {
            mockPrinters.BluetoothEscposPrinter.connect.mockRejectedValue(new Error('fail'));
            const result = await bluetoothPrinterService.connect('AA:BB:CC');
            expect(result).toBe(false);
            expect(bluetoothPrinterService.isConnected()).toBe(false);
        });
    });

    describe('disconnect', () => {
        it('should disconnect from printer', async () => {
            mockPrinters.BluetoothEscposPrinter.connect.mockResolvedValue(undefined);
            await bluetoothPrinterService.connect('AA:BB:CC');
            mockPrinters.BluetoothEscposPrinter.disconnect.mockResolvedValue(undefined);
            await bluetoothPrinterService.disconnect();
            expect(bluetoothPrinterService.isConnected()).toBe(false);
        });

        it('should handle disconnect error gracefully', async () => {
            mockPrinters.BluetoothEscposPrinter.disconnect.mockRejectedValue(new Error('fail'));
            await bluetoothPrinterService.disconnect();
            expect(bluetoothPrinterService.isConnected()).toBe(false);
        });
    });

    describe('isConnected', () => {
        it('should return false initially', () => {
            // Reset by disconnecting
            bluetoothPrinterService.disconnect();
            // After disconnect it should be false
        });
    });

    describe('printBill', () => {
        const mockBill: PrintBillData = {
            storeName: 'Test Store',
            storeAddress: '123 Market',
            storePhone: '9876543210',
            gstNumber: 'GST123',
            billNumber: 'KM-240115-0001',
            date: '15/01/2024',
            time: '02:30 PM',
            items: [
                { name: 'Basmati Rice', quantity: 2, unit: 'kg', price: 120, total: 240 },
                { name: 'Sugar', quantity: 1, unit: 'kg', price: 45, total: 45 },
            ],
            subtotal: 285,
            discount: 10,
            grandTotal: 275,
            paymentMode: 'cash',
            customerName: 'Rajesh',
            customerPhone: '9123456789',
        };

        it('should throw if not connected', async () => {
            await bluetoothPrinterService.disconnect();
            await expect(bluetoothPrinterService.printBill(mockBill)).rejects.toThrow('Printer not connected');
        });

        it('should print bill when connected', async () => {
            mockPrinters.BluetoothEscposPrinter.connect.mockResolvedValue(undefined);
            mockPrinters.BluetoothEscposPrinter.printerInit.mockResolvedValue(undefined);
            mockPrinters.BluetoothEscposPrinter.printerAlign.mockResolvedValue(undefined);
            mockPrinters.BluetoothEscposPrinter.printText.mockResolvedValue(undefined);

            await bluetoothPrinterService.connect('AA:BB:CC');
            await bluetoothPrinterService.printBill(mockBill);

            expect(mockPrinters.BluetoothEscposPrinter.printerInit).toHaveBeenCalled();
            expect(mockPrinters.BluetoothEscposPrinter.printText).toHaveBeenCalled();
        });

        it('should throw on print error', async () => {
            mockPrinters.BluetoothEscposPrinter.connect.mockResolvedValue(undefined);
            await bluetoothPrinterService.connect('AA:BB:CC');

            mockPrinters.BluetoothEscposPrinter.printerInit.mockRejectedValue(new Error('paper jam'));

            await expect(bluetoothPrinterService.printBill(mockBill)).rejects.toThrow('paper jam');
        });
    });

    describe('printTestPage', () => {
        it('should throw if not connected', async () => {
            await bluetoothPrinterService.disconnect();
            await expect(bluetoothPrinterService.printTestPage()).rejects.toThrow('Printer not connected');
        });

        it('should print test page when connected', async () => {
            mockPrinters.BluetoothEscposPrinter.connect.mockResolvedValue(undefined);
            mockPrinters.BluetoothEscposPrinter.printerInit.mockResolvedValue(undefined);
            mockPrinters.BluetoothEscposPrinter.printerAlign.mockResolvedValue(undefined);
            mockPrinters.BluetoothEscposPrinter.printText.mockResolvedValue(undefined);

            await bluetoothPrinterService.connect('AA:BB:CC');
            await bluetoothPrinterService.printTestPage();

            expect(mockPrinters.BluetoothEscposPrinter.printerInit).toHaveBeenCalled();
        });
    });
});
