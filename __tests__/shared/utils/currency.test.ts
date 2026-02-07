import { formatCurrency, parseCurrency } from '@shared/utils/currency';

describe('currency utils', () => {
  it('should format number to Indian currency', () => {
    expect(formatCurrency(1000)).toBe('₹1,000');
  });

  it('should format with decimals', () => {
    expect(formatCurrency(1234.56)).toBe('₹1,235');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('₹0');
  });

  it('should format negative numbers', () => {
    const result = formatCurrency(-500);
    expect(result).toContain('500');
  });

  it('should parse currency string to number', () => {
    expect(parseCurrency('₹1,000')).toBe(1000);
  });

  it('should parse plain number string', () => {
    expect(parseCurrency('500')).toBe(500);
  });

  it('should return 0 for invalid input', () => {
    expect(parseCurrency('')).toBe(0);
    expect(parseCurrency('abc')).toBe(0);
  });
});
