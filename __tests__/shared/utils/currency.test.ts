import { formatCurrency, formatCurrencyShort, parseCurrencyInput } from '@shared/utils/currency';

describe('currency utils', () => {
    describe('formatCurrency', () => {
        it('should format number to Indian currency', () => {
            expect(formatCurrency(1000)).toBe('₹1,000.00');
        });

        it('should format with decimals', () => {
            expect(formatCurrency(1234.56)).toBe('₹1,234.56');
        });

        it('should format zero', () => {
            expect(formatCurrency(0)).toBe('₹0.00');
        });

        it('should format negative numbers with sign', () => {
            expect(formatCurrency(-500)).toBe('-₹500.00');
        });

        it('should format large numbers with Indian grouping', () => {
            expect(formatCurrency(1234567)).toBe('₹12,34,567.00');
        });
    });

    describe('formatCurrencyShort', () => {
        it('should format lakhs', () => {
            expect(formatCurrencyShort(200000)).toBe('₹2.0L');
        });

        it('should format thousands', () => {
            expect(formatCurrencyShort(5000)).toBe('₹5.0K');
        });

        it('should format small amounts normally', () => {
            expect(formatCurrencyShort(999)).toBe('₹999.00');
        });
    });

    describe('parseCurrencyInput', () => {
        it('should parse currency string to number', () => {
            expect(parseCurrencyInput('₹1,000')).toBe(1000);
        });

        it('should parse plain number string', () => {
            expect(parseCurrencyInput('500')).toBe(500);
        });

        it('should return 0 for invalid input', () => {
            expect(parseCurrencyInput('')).toBe(0);
            expect(parseCurrencyInput('abc')).toBe(0);
        });

        it('should parse decimal strings', () => {
            expect(parseCurrencyInput('99.50')).toBe(99.5);
        });
    });
});
