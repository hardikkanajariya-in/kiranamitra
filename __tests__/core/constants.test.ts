import {
    PAYMENT_MODES,
    BILL_STATUSES,
    STOCK_REASONS,
    UNITS,
    UNIT_OPTIONS,
    CREDIT_ENTRY_TYPES,
    THEME_MODES,
    LANGUAGES,
    DEFAULT_LOW_STOCK_THRESHOLD,
    PIN_LENGTH,
    BILL_NUMBER_PREFIX,
    DATE_FORMAT,
    DATE_TIME_FORMAT,
    CURRENCY_SYMBOL,
    APP_VERSION,
} from '@core/constants';

describe('constants', () => {
    describe('PAYMENT_MODES', () => {
        it('should have all payment modes', () => {
            expect(PAYMENT_MODES.CASH).toBe('cash');
            expect(PAYMENT_MODES.UPI).toBe('upi');
            expect(PAYMENT_MODES.CARD).toBe('card');
            expect(PAYMENT_MODES.CREDIT).toBe('credit');
            expect(PAYMENT_MODES.MIXED).toBe('mixed');
        });
    });

    describe('BILL_STATUSES', () => {
        it('should have completed and cancelled', () => {
            expect(BILL_STATUSES.COMPLETED).toBe('completed');
            expect(BILL_STATUSES.CANCELLED).toBe('cancelled');
        });
    });

    describe('STOCK_REASONS', () => {
        it('should have all stock reasons', () => {
            expect(STOCK_REASONS.PURCHASE).toBe('purchase');
            expect(STOCK_REASONS.DAMAGE).toBe('damage');
            expect(STOCK_REASONS.RETURN).toBe('return');
            expect(STOCK_REASONS.SALE).toBe('sale');
            expect(STOCK_REASONS.MANUAL).toBe('manual');
        });
    });

    describe('UNITS', () => {
        it('should have all units', () => {
            expect(UNITS.KG).toBe('kg');
            expect(UNITS.PIECE).toBe('piece');
            expect(UNITS.LITRE).toBe('litre');
            expect(UNITS.PACKET).toBe('packet');
            expect(UNITS.DOZEN).toBe('dozen');
        });
    });

    describe('UNIT_OPTIONS', () => {
        it('should have 5 unit options', () => {
            expect(UNIT_OPTIONS).toHaveLength(5);
        });

        it('should have value and labelKey for each option', () => {
            UNIT_OPTIONS.forEach((opt) => {
                expect(opt.value).toBeDefined();
                expect(opt.labelKey).toContain('products:units.');
            });
        });
    });

    describe('CREDIT_ENTRY_TYPES', () => {
        it('should have credit and payment', () => {
            expect(CREDIT_ENTRY_TYPES.CREDIT).toBe('credit');
            expect(CREDIT_ENTRY_TYPES.PAYMENT).toBe('payment');
        });
    });

    describe('THEME_MODES', () => {
        it('should have light, dark, and system', () => {
            expect(THEME_MODES.LIGHT).toBe('light');
            expect(THEME_MODES.DARK).toBe('dark');
            expect(THEME_MODES.SYSTEM).toBe('system');
        });
    });

    describe('LANGUAGES', () => {
        it('should have 3 languages', () => {
            expect(LANGUAGES).toHaveLength(3);
        });

        it('should have en, hi, gu', () => {
            expect(LANGUAGES[0].code).toBe('en');
            expect(LANGUAGES[1].code).toBe('hi');
            expect(LANGUAGES[2].code).toBe('gu');
        });

        it('should have native labels', () => {
            expect(LANGUAGES[1].nativeLabel).toBe('हिन्दी');
            expect(LANGUAGES[2].nativeLabel).toBe('ગુજરાતી');
        });
    });

    describe('App constants', () => {
        it('should have correct defaults', () => {
            expect(DEFAULT_LOW_STOCK_THRESHOLD).toBe(10);
            expect(PIN_LENGTH).toBe(4);
            expect(BILL_NUMBER_PREFIX).toBe('KM');
            expect(DATE_FORMAT).toBe('DD/MM/YYYY');
            expect(DATE_TIME_FORMAT).toBe('DD/MM/YYYY hh:mm A');
            expect(CURRENCY_SYMBOL).toBe('₹');
            expect(APP_VERSION).toBe('1.0.0');
        });
    });
});
