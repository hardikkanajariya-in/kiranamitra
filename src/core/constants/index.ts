// ── Payment Modes ──
export const PAYMENT_MODES = {
  CASH: 'cash',
  UPI: 'upi',
  CARD: 'card',
  CREDIT: 'credit',
  MIXED: 'mixed',
} as const;

export type PaymentMode = (typeof PAYMENT_MODES)[keyof typeof PAYMENT_MODES];

// ── Bill Statuses ──
export const BILL_STATUSES = {
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type BillStatus = (typeof BILL_STATUSES)[keyof typeof BILL_STATUSES];

// ── Stock Adjustment Reasons ──
export const STOCK_REASONS = {
  PURCHASE: 'purchase',
  DAMAGE: 'damage',
  RETURN: 'return',
  SALE: 'sale',
  MANUAL: 'manual',
} as const;

export type StockReason = (typeof STOCK_REASONS)[keyof typeof STOCK_REASONS];

// ── Product Units ──
export const UNITS = {
  KG: 'kg',
  PIECE: 'piece',
  LITRE: 'litre',
  PACKET: 'packet',
  DOZEN: 'dozen',
} as const;

export type ProductUnit = (typeof UNITS)[keyof typeof UNITS];

export const UNIT_OPTIONS: { value: ProductUnit; labelKey: string }[] = [
  { value: 'kg', labelKey: 'products:units.kg' },
  { value: 'piece', labelKey: 'products:units.piece' },
  { value: 'litre', labelKey: 'products:units.litre' },
  { value: 'packet', labelKey: 'products:units.packet' },
  { value: 'dozen', labelKey: 'products:units.dozen' },
];

// ── Credit Entry Types ──
export const CREDIT_ENTRY_TYPES = {
  CREDIT: 'credit',
  PAYMENT: 'payment',
} as const;

export type CreditEntryType = (typeof CREDIT_ENTRY_TYPES)[keyof typeof CREDIT_ENTRY_TYPES];

// ── Theme Modes ──
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

// ── Languages ──
export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
] as const;

export type LanguageCode = 'en' | 'hi' | 'gu';

// ── Defaults ──
export const DEFAULT_LOW_STOCK_THRESHOLD = 10;
export const PIN_LENGTH = 4;
export const BILL_NUMBER_PREFIX = 'KM';
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY hh:mm A';
export const CURRENCY_SYMBOL = '₹';
export const APP_VERSION = '1.0.0';
