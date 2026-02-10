import { generatePDF } from 'react-native-html-to-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';
import { formatDateTime, formatDate } from '@shared/utils/date';
import { CURRENCY_SYMBOL } from '@core/constants';

export interface BillPdfData {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  gstNumber?: string;
  billNumber: string;
  createdAt: Date;
  items: BillPdfItem[];
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  paymentMode: string;
  customerName?: string;
  customerPhone?: string;
  status: string;
}

export interface BillPdfItem {
  productName: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  total: number;
}

const formatCurrency = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
};

const generateBillHtml = (data: BillPdfData): string => {
  const itemsHtml = data.items
    .map(
      (item, index) => `
      <tr>
        <td style="padding: 8px 4px; border-bottom: 1px solid #eee;">${index + 1}</td>
        <td style="padding: 8px 4px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 8px 4px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}${item.unit ? ` ${item.unit}` : ''}</td>
        <td style="padding: 8px 4px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unitPrice)}</td>
        <td style="padding: 8px 4px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.total)}</td>
      </tr>
    `,
    )
    .join('');

  const isCancelled = data.status === 'cancelled';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12px;
          color: #333;
          padding: 20px;
          background: #fff;
        }
        .container {
          max-width: 400px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 2px solid #2e7d32;
          margin-bottom: 16px;
        }
        .store-name {
          font-size: 22px;
          font-weight: bold;
          color: #2e7d32;
          margin-bottom: 4px;
        }
        .store-info {
          font-size: 11px;
          color: #666;
          line-height: 1.4;
        }
        .bill-info {
          display: flex;
          justify-content: space-between;
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .bill-number {
          font-size: 16px;
          font-weight: bold;
          color: #2e7d32;
        }
        .bill-date {
          color: #666;
          font-size: 11px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-completed {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .status-cancelled {
          background: #ffebee;
          color: #c62828;
        }
        .customer-section {
          background: #e3f2fd;
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .customer-label {
          font-size: 10px;
          color: #1565c0;
          text-transform: uppercase;
          font-weight: bold;
        }
        .customer-name {
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        .items-table th {
          background: #2e7d32;
          color: white;
          padding: 10px 4px;
          font-size: 11px;
          text-align: left;
        }
        .items-table th:nth-child(3),
        .items-table th:nth-child(4),
        .items-table th:nth-child(5) {
          text-align: right;
        }
        .summary-section {
          border-top: 2px solid #eee;
          padding-top: 12px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
        }
        .summary-label {
          color: #666;
        }
        .summary-value {
          font-weight: 500;
        }
        .discount-row {
          color: #2e7d32;
        }
        .total-row {
          border-top: 2px solid #2e7d32;
          margin-top: 8px;
          padding-top: 12px;
        }
        .total-label {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
        .total-value {
          font-size: 20px;
          font-weight: bold;
          color: #2e7d32;
        }
        .payment-badge {
          display: inline-block;
          background: #e8f5e9;
          color: #2e7d32;
          padding: 6px 16px;
          border-radius: 16px;
          font-weight: bold;
          font-size: 12px;
          margin-top: 12px;
        }
        .footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px dashed #ccc;
          color: #999;
          font-size: 10px;
        }
        ${isCancelled ? '.total-value { color: #c62828; text-decoration: line-through; }' : ''}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="store-name">${data.storeName || 'Store Name'}</div>
          <div class="store-info">
            ${data.storeAddress ? `${data.storeAddress}<br>` : ''}
            ${data.storePhone ? `Phone: ${data.storePhone}<br>` : ''}
            ${data.gstNumber ? `GSTIN: ${data.gstNumber}` : ''}
          </div>
        </div>

        <div class="bill-info">
          <div>
            <div class="bill-number">#${data.billNumber}</div>
            <div class="bill-date">${formatDateTime(data.createdAt)}</div>
          </div>
          <div>
            <span class="status-badge ${isCancelled ? 'status-cancelled' : 'status-completed'}">
              ${data.status}
            </span>
          </div>
        </div>

        ${data.customerName
      ? `
        <div class="customer-section">
          <div class="customer-label">Customer</div>
          <div class="customer-name">${data.customerName}</div>
          ${data.customerPhone ? `<div style="font-size: 11px; color: #666;">${data.customerPhone}</div>` : ''}
        </div>
        `
      : ''
    }

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Item</th>
              <th style="width: 60px; text-align: center;">Qty</th>
              <th style="width: 70px; text-align: right;">Rate</th>
              <th style="width: 80px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="summary-section">
          <div class="summary-row">
            <span class="summary-label">Subtotal (${data.items.length} items)</span>
            <span class="summary-value">${formatCurrency(data.subtotal)}</span>
          </div>
          ${data.discountTotal > 0
      ? `
          <div class="summary-row discount-row">
            <span>Discount</span>
            <span>-${formatCurrency(data.discountTotal)}</span>
          </div>
          `
      : ''
    }
          <div class="summary-row total-row">
            <span class="total-label">Grand Total</span>
            <span class="total-value">${formatCurrency(data.grandTotal)}</span>
          </div>
          <div style="text-align: center;">
            <span class="payment-badge">${data.paymentMode.toUpperCase()}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your purchase!</p>
          <p style="margin-top: 4px;">Generated on ${formatDate(new Date())}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const billPdfService = {
  /**
   * Generate PDF file from bill data
   * @returns Path to the generated PDF file
   */
  async generatePdf(data: BillPdfData): Promise<string> {
    const html = generateBillHtml(data);

    const pdf = await generatePDF({
      html,
      fileName: `Bill_${data.billNumber}`,
      directory: 'Documents',
      width: 400,
      height: 600,
      padding: 0,
    });
    if (!pdf.filePath) {
      throw new Error('Failed to generate PDF');
    }

    return pdf.filePath;
  },

  /**
   * Generate plain text bill for sharing as fallback
   */
  generateTextBill(data: BillPdfData): string {
    const lines: string[] = [];
    lines.push(data.storeName);
    if (data.storeAddress) lines.push(data.storeAddress);
    if (data.storePhone) lines.push(`Ph: ${data.storePhone}`);
    if (data.gstNumber) lines.push(`GST: ${data.gstNumber}`);
    lines.push('─'.repeat(30));
    lines.push(`Bill: #${data.billNumber}`);
    lines.push(`Date: ${formatDateTime(data.createdAt)}`);
    lines.push(`Payment: ${data.paymentMode.toUpperCase()}`);
    if (data.customerName) lines.push(`Customer: ${data.customerName}`);
    lines.push('─'.repeat(30));

    data.items.forEach((item, i) => {
      lines.push(`${i + 1}. ${item.productName}`);
      lines.push(`   ${item.quantity} × ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.total)}`);
    });

    lines.push('─'.repeat(30));
    lines.push(`Subtotal: ${formatCurrency(data.subtotal)}`);
    if (data.discountTotal > 0) {
      lines.push(`Discount: -${formatCurrency(data.discountTotal)}`);
    }
    lines.push(`Grand Total: ${formatCurrency(data.grandTotal)}`);
    lines.push('─'.repeat(30));
    lines.push('Thank you for your purchase!');

    return lines.join('\n');
  },

  /**
   * Generate PDF and open it in the device's native PDF viewer.
   * The user can then share from the viewer app itself.
   */
  async sharePdf(data: BillPdfData): Promise<void> {
    const filePath = await this.generatePdf(data);

    if (Platform.OS === 'android') {
      await ReactNativeBlobUtil.android.actionViewIntent(
        filePath,
        'application/pdf',
      );
    } else {
      await ReactNativeBlobUtil.ios.openDocument(filePath);
    }
  },

  /**
   * Generate PDF and return path for preview
   */
  async getPdfForPreview(data: BillPdfData): Promise<string> {
    return await this.generatePdf(data);
  },
};
