import type { PaymentMode, ProductUnit } from '@core/constants';

// ── Store Profile ──
export interface StoreProfile {
  name: string;
  address: string;
  phone: string;
  gstNumber: string;
}

// ── Printer Config ──
export interface PrinterConfig {
  name: string;
  address: string;
  connected: boolean;
}

// ── Cart Item (billing session) ──
export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  unit: ProductUnit;
  availableStock: number;
}

// ── Date Range ──
export interface DateRange {
  from: Date;
  to: Date;
}

// ── Language ──
export interface Language {
  code: string;
  label: string;
  nativeLabel: string;
}

// ── Bluetooth Device ──
export interface BluetoothDevice {
  name: string;
  address: string;
}

// ── Report Types ──
export interface SalesReportData {
  totalSales: number;
  totalBills: number;
  averageBill: number;
  dailyBreakdown: DailySales[];
}

export interface DailySales {
  date: string;
  total: number;
  billCount: number;
}

export interface InventoryReportData {
  totalStockValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  products: ProductStockInfo[];
}

export interface ProductStockInfo {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  stockValue: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export interface CreditReportData {
  totalOutstanding: number;
  customers: CustomerCreditInfo[];
}

export interface CustomerCreditInfo {
  id: string;
  name: string;
  phone: string;
  outstanding: number;
  lastTransactionDate: string;
}

export interface ProductPerformanceData {
  id: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

// ── Bill Summary for display ──
export interface BillSummary {
  id: string;
  billNumber: string;
  customerName: string;
  grandTotal: number;
  paymentMode: PaymentMode;
  status: string;
  createdAt: Date;
}
