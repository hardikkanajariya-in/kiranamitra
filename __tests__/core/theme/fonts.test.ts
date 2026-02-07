import { fonts } from '@core/theme/fonts';

describe('fonts', () => {
    it('should export configured fonts', () => {
        expect(fonts).toBeDefined();
    });

    it('should have display variants', () => {
        expect(fonts.displayLarge).toBeDefined();
        expect(fonts.displayMedium).toBeDefined();
        expect(fonts.displaySmall).toBeDefined();
    });

    it('should have headline variants', () => {
        expect(fonts.headlineLarge).toBeDefined();
        expect(fonts.headlineMedium).toBeDefined();
        expect(fonts.headlineSmall).toBeDefined();
    });

    it('should have title variants', () => {
        expect(fonts.titleLarge).toBeDefined();
        expect(fonts.titleMedium).toBeDefined();
        expect(fonts.titleSmall).toBeDefined();
    });

    it('should have body variants', () => {
        expect(fonts.bodyLarge).toBeDefined();
        expect(fonts.bodyMedium).toBeDefined();
        expect(fonts.bodySmall).toBeDefined();
    });

    it('should have label variants', () => {
        expect(fonts.labelLarge).toBeDefined();
        expect(fonts.labelMedium).toBeDefined();
        expect(fonts.labelSmall).toBeDefined();
    });
});
