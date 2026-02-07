import { migrations } from '@core/database/migrations';

describe('database migrations', () => {
    it('should export migrations object', () => {
        expect(migrations).toBeDefined();
    });

    it('should have a valid migrations structure', () => {
        // schemaMigrations returns an object; the exact shape may vary
        expect(typeof migrations).toBe('object');
    });
});
