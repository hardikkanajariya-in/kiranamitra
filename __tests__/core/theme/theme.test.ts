import {
    lightTheme,
    darkTheme,
    CombinedLightTheme,
    CombinedDarkTheme,
} from '@core/theme';

describe('theme', () => {
    describe('lightTheme', () => {
        it('should have green primary color', () => {
            expect(lightTheme.colors.primary).toBe('#2E7D32');
        });

        it('should have roundness of 12', () => {
            expect(lightTheme.roundness).toBe(12);
        });

        it('should have fonts configured', () => {
            expect(lightTheme.fonts).toBeDefined();
        });

        it('should have proper surface colors', () => {
            expect(lightTheme.colors.background).toBe('#FAFAFA');
            expect(lightTheme.colors.surface).toBe('#FFFFFF');
        });

        it('should have error color', () => {
            expect(lightTheme.colors.error).toBe('#D32F2F');
        });

        it('should have elevation levels', () => {
            expect(lightTheme.colors.elevation.level0).toBe('transparent');
            expect(lightTheme.colors.elevation.level1).toBeDefined();
        });
    });

    describe('darkTheme', () => {
        it('should have dark background', () => {
            expect(darkTheme.colors.background).toBe('#121212');
        });

        it('should have lighter primary for dark mode', () => {
            expect(darkTheme.colors.primary).toBe('#81C784');
        });

        it('should have dark surface color', () => {
            expect(darkTheme.colors.surface).toBe('#1E1E1E');
        });
    });

    describe('CombinedLightTheme', () => {
        it('should merge Paper and Navigation themes', () => {
            expect(CombinedLightTheme.roundness).toBe(12);
            expect(CombinedLightTheme.colors).toBeDefined();
        });

        it('should have colors from both themes', () => {
            expect(CombinedLightTheme.colors.primary).toBeDefined();
            expect(CombinedLightTheme.dark).toBe(false);
        });
    });

    describe('CombinedDarkTheme', () => {
        it('should be a dark theme', () => {
            expect(CombinedDarkTheme.dark).toBe(true);
        });

        it('should have colors defined', () => {
            expect(CombinedDarkTheme.colors.primary).toBeDefined();
            expect(CombinedDarkTheme.colors.background).toBeDefined();
        });
    });
});
