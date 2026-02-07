import { CartItem } from '@core/types';

let idCounter = 0;

export const createMockCustomer = (overrides: any = {}) => ({
  id: `customer-${++idCounter}`,
  name: 'Test Customer',
  phone: '9876543210',
  address: '123 Test Street',
  notes: '',
  creditBalance: 0,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

export const createMockCategory = (overrides: any = {}) => ({
  id: `category-${++idCounter}`,
  name: 'Test Category',
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

export const createMockProduct = (overrides: any = {}) => ({
  id: `product-${++idCounter}`,
  name: 'Test Product',
  categoryId: 'category-1',
  sku: 'SKU001',
  barcode: '',
  purchasePrice: 80,
  sellingPrice: 100,
  unit: 'pcs',
  currentStock: 50,
  lowStockThreshold: 10,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

export const createMockBill = (overrides: any = {}) => ({
  id: `bill-${++idCounter}`,
  billNumber: 'BILL-240101-001',
  customerId: '',
  customerName: 'Walk-in',
  subtotal: 500,
  discount: 0,
  grandTotal: 500,
  paymentMode: 'cash',
  status: 'completed',
  notes: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

export const createMockBillItem = (overrides: any = {}) => ({
  id: `bill-item-${++idCounter}`,
  billId: 'bill-1',
  productId: 'product-1',
  productName: 'Test Product',
  quantity: 2,
  unitPrice: 100,
  discount: 0,
  total: 200,
  unit: 'pcs',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

export const createMockCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  productId: `product-${++idCounter}`,
  productName: 'Test Product',
  quantity: 1,
  unitPrice: 100,
  discount: 0,
  total: 100,
  unit: 'pcs' as any,
  availableStock: 50,
  ...overrides,
});

export const createMockCreditEntry = (overrides: any = {}) => ({
  id: `credit-${++idCounter}`,
  customerId: 'customer-1',
  billId: '',
  type: 'credit',
  amount: 500,
  balanceAfter: 500,
  notes: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

export const resetIdCounter = () => {
  idCounter = 0;
};
