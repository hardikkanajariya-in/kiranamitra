import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'kiranamitra-storage',
});

// ── PIN ──
export const getPin = (): string | null => storage.getString('pin_hash') ?? null;
export const setPin = (hash: string): void => storage.set('pin_hash', hash);
export const removePin = (): void => storage.delete('pin_hash');
export const isPinSet = (): boolean => storage.contains('pin_hash');

// ── Language ──
export const getLanguage = (): string => storage.getString('language') ?? 'en';
export const setLanguage = (code: string): void => storage.set('language', code);

// ── Theme ──
export const getThemeMode = (): string => storage.getString('theme_mode') ?? 'system';
export const setThemeMode = (mode: string): void => storage.set('theme_mode', mode);

// ── Store Profile ──
export interface StoreProfile {
  name: string;
  address: string;
  phone: string;
  gstNumber: string;
}

const DEFAULT_STORE: StoreProfile = {
  name: 'My Kirana Store',
  address: '',
  phone: '',
  gstNumber: '',
};

export const getStoreProfile = (): StoreProfile => {
  const raw = storage.getString('store_profile');
  if (!raw) return DEFAULT_STORE;
  try {
    return JSON.parse(raw) as StoreProfile;
  } catch {
    return DEFAULT_STORE;
  }
};

export const setStoreProfile = (profile: StoreProfile): void => {
  storage.set('store_profile', JSON.stringify(profile));
};

// ── Printer Config ──
export interface PrinterConfig {
  name: string;
  address: string;
  connected: boolean;
}

export const getPrinterConfig = (): PrinterConfig | null => {
  const raw = storage.getString('printer_config');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PrinterConfig;
  } catch {
    return null;
  }
};

export const setPrinterConfig = (config: PrinterConfig): void => {
  storage.set('printer_config', JSON.stringify(config));
};

export const removePrinterConfig = (): void => storage.delete('printer_config');

// ── Onboarding ──
export const isOnboardingDone = (): boolean => storage.getBoolean('onboarding_done') ?? false;
export const setOnboardingDone = (): void => storage.set('onboarding_done', true);

// ── Bill Sequence Counter ──
export const getBillSequence = (): number => storage.getNumber('bill_sequence') ?? 0;
export const incrementBillSequence = (): number => {
  const next = getBillSequence() + 1;
  storage.set('bill_sequence', next);
  return next;
};

// ── Last Bill Date (for resetting daily sequence) ──
export const getLastBillDate = (): string => storage.getString('last_bill_date') ?? '';
export const setLastBillDate = (date: string): void => storage.set('last_bill_date', date);
export const resetBillSequence = (): void => storage.set('bill_sequence', 0);
