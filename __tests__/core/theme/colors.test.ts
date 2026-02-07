import { Colors } from '@core/theme/colors';

describe('Colors', () => {
    it('should have primary color', () => {
        expect(Colors.primary).toBe('#2E7D32');
    });

    it('should have dark mode colors', () => {
        expect(Colors.dark.background).toBe('#121212');
        expect(Colors.dark.surface).toBe('#1E1E1E');
        expect(Colors.dark.primary).toBe('#81C784');
    });

    it('should have stock status colors', () => {
        expect(Colors.stockOk).toBeDefined();
        expect(Colors.stockLow).toBeDefined();
        expect(Colors.stockOut).toBeDefined();
    });

    it('should have credit and payment colors', () => {
        expect(Colors.creditRed).toBeDefined();
        expect(Colors.paymentGreen).toBeDefined();
    });

    it('should have background variant colors', () => {
        expect(Colors.successBg).toBe('#E8F5E9');
        expect(Colors.warningBg).toBe('#FFF3E0');
        expect(Colors.errorBg).toBe('#FFEBEE');
        expect(Colors.infoBg).toBe('#E3F2FD');
    });

    it('should have error color', () => {
        expect(Colors.error).toBe('#D32F2F');
    });

    it('should have surface colors', () => {
        expect(Colors.background).toBe('#FAFAFA');
        expect(Colors.surface).toBe('#FFFFFF');
    });
});
