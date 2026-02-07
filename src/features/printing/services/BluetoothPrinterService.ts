import { PrinterService, PrintBillData, PrintBillItem } from './PrinterService';
import { formatCurrency } from '@shared/utils/currency';

// ESC/POS command constants
const ESC = '\x1B';
const GS = '\x1D';
const LF = '\x0A';
const COMMANDS = {
  INIT: `${ESC}@`, // Initialize printer
  ALIGN_CENTER: `${ESC}a\x01`,
  ALIGN_LEFT: `${ESC}a\x00`,
  ALIGN_RIGHT: `${ESC}a\x02`,
  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,
  DOUBLE_HEIGHT_ON: `${GS}!\x11`,
  DOUBLE_HEIGHT_OFF: `${GS}!\x00`,
  FONT_SMALL: `${ESC}M\x01`,
  FONT_NORMAL: `${ESC}M\x00`,
  CUT: `${GS}V\x01`, // Partial cut
  FEED: LF,
  LINE: '--------------------------------',
  DOUBLE_LINE: '================================',
};

const PAPER_WIDTH = 32; // Characters per line for 58mm printer

class BluetoothPrinterService implements PrinterService {
  private connected = false;
  private deviceAddress = '';

  async connect(address: string): Promise<boolean> {
    try {
      // Dynamic import to avoid crash if not installed
      const { BluetoothEscposPrinter } = require('react-native-bluetooth-escpos-printer');
      await BluetoothEscposPrinter.connect(address);
      this.connected = true;
      this.deviceAddress = address;
      return true;
    } catch (error) {
      console.error('Printer connect error:', error);
      this.connected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const { BluetoothEscposPrinter } = require('react-native-bluetooth-escpos-printer');
      await BluetoothEscposPrinter.disconnect();
    } catch (error) {
      console.error('Printer disconnect error:', error);
    }
    this.connected = false;
    this.deviceAddress = '';
  }

  isConnected(): boolean {
    return this.connected;
  }

  async printBill(bill: PrintBillData): Promise<void> {
    if (!this.connected) {
      throw new Error('Printer not connected');
    }

    try {
      const { BluetoothEscposPrinter, ALIGN } = require('react-native-bluetooth-escpos-printer');

      // Initialize
      await BluetoothEscposPrinter.printerInit();

      // Store Header
      await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
      await BluetoothEscposPrinter.printText(`${bill.storeName}\n`, { encoding: 'UTF-8', widthtimes: 1, heigthtimes: 1 });
      if (bill.storeAddress) {
        await BluetoothEscposPrinter.printText(`${bill.storeAddress}\n`, { encoding: 'UTF-8' });
      }
      if (bill.storePhone) {
        await BluetoothEscposPrinter.printText(`Ph: ${bill.storePhone}\n`, { encoding: 'UTF-8' });
      }
      if (bill.gstNumber) {
        await BluetoothEscposPrinter.printText(`GST: ${bill.gstNumber}\n`, { encoding: 'UTF-8' });
      }

      await BluetoothEscposPrinter.printText(`${COMMANDS.DOUBLE_LINE}\n`, {});

      // Bill Info
      await BluetoothEscposPrinter.printerAlign(ALIGN.LEFT);
      await BluetoothEscposPrinter.printText(`Bill#: ${bill.billNumber}\n`, { encoding: 'UTF-8' });
      await BluetoothEscposPrinter.printText(`Date: ${bill.date}  ${bill.time}\n`, { encoding: 'UTF-8' });

      if (bill.customerName) {
        await BluetoothEscposPrinter.printText(`Customer: ${bill.customerName}\n`, { encoding: 'UTF-8' });
      }

      await BluetoothEscposPrinter.printText(`${COMMANDS.LINE}\n`, {});

      // Column headers
      await BluetoothEscposPrinter.printText(
        this.padColumns('Item', 'Qty', 'Amt') + '\n',
        { encoding: 'UTF-8' },
      );
      await BluetoothEscposPrinter.printText(`${COMMANDS.LINE}\n`, {});

      // Items
      for (const item of bill.items) {
        const name = item.name.length > 16 ? item.name.substring(0, 16) : item.name;
        const qty = `${item.quantity}${item.unit ? item.unit.charAt(0) : ''}`;
        const amt = formatCurrency(item.total).replace('₹', '');
        await BluetoothEscposPrinter.printText(
          this.padColumns(name, qty, amt) + '\n',
          { encoding: 'UTF-8' },
        );
      }

      await BluetoothEscposPrinter.printText(`${COMMANDS.LINE}\n`, {});

      // Totals
      await BluetoothEscposPrinter.printerAlign(ALIGN.RIGHT);

      if (bill.discount > 0) {
        await BluetoothEscposPrinter.printText(
          `Subtotal: ${formatCurrency(bill.subtotal)}\n`,
          { encoding: 'UTF-8' },
        );
        await BluetoothEscposPrinter.printText(
          `Discount: -${formatCurrency(bill.discount)}\n`,
          { encoding: 'UTF-8' },
        );
      }

      await BluetoothEscposPrinter.printText(
        `TOTAL: ${formatCurrency(bill.grandTotal)}\n`,
        { encoding: 'UTF-8', widthtimes: 1, heigthtimes: 1 },
      );

      await BluetoothEscposPrinter.printerAlign(ALIGN.LEFT);
      await BluetoothEscposPrinter.printText(
        `Payment: ${bill.paymentMode.toUpperCase()}\n`,
        { encoding: 'UTF-8' },
      );

      await BluetoothEscposPrinter.printText(`${COMMANDS.DOUBLE_LINE}\n`, {});

      // Footer
      await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
      await BluetoothEscposPrinter.printText('Thank You! Visit Again\n', { encoding: 'UTF-8' });
      await BluetoothEscposPrinter.printText('\n\n\n', {});
    } catch (error) {
      console.error('Print bill error:', error);
      throw error;
    }
  }

  async printTestPage(): Promise<void> {
    if (!this.connected) {
      throw new Error('Printer not connected');
    }

    try {
      const { BluetoothEscposPrinter, ALIGN } = require('react-native-bluetooth-escpos-printer');

      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printerAlign(ALIGN.CENTER);
      await BluetoothEscposPrinter.printText('=== TEST PRINT ===\n', { encoding: 'UTF-8', widthtimes: 1, heigthtimes: 1 });
      await BluetoothEscposPrinter.printText('KiranaMitra\n', { encoding: 'UTF-8' });
      await BluetoothEscposPrinter.printText('Printer is working!\n', { encoding: 'UTF-8' });
      await BluetoothEscposPrinter.printText(`${COMMANDS.DOUBLE_LINE}\n`, {});
      await BluetoothEscposPrinter.printText('\n\n\n', {});
    } catch (error) {
      console.error('Test print error:', error);
      throw error;
    }
  }

  private padColumns(col1: string, col2: string, col3: string): string {
    const col1Width = 16;
    const col2Width = 6;
    const col3Width = 10;

    return (
      col1.padEnd(col1Width).substring(0, col1Width) +
      col2.padStart(col2Width).substring(0, col2Width) +
      col3.padStart(col3Width).substring(0, col3Width)
    );
  }
}

export const bluetoothPrinterService = new BluetoothPrinterService();
