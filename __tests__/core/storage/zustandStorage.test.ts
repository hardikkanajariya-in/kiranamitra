import { zustandMMKVStorage } from '@core/storage/zustandStorage';
import { clearMmkvStore } from '../../setup';

describe('zustandMMKVStorage', () => {
    beforeEach(() => {
        clearMmkvStore();
    });

    it('should set and get item', () => {
        zustandMMKVStorage.setItem('test-key', '{"value": 42}');
        expect(zustandMMKVStorage.getItem('test-key')).toBe('{"value": 42}');
    });

    it('should return null for non-existent key', () => {
        expect(zustandMMKVStorage.getItem('missing')).toBeNull();
    });

    it('should remove item', () => {
        zustandMMKVStorage.setItem('test-key', 'data');
        zustandMMKVStorage.removeItem('test-key');
        expect(zustandMMKVStorage.getItem('test-key')).toBeNull();
    });

    it('should implement StateStorage interface', () => {
        expect(typeof zustandMMKVStorage.getItem).toBe('function');
        expect(typeof zustandMMKVStorage.setItem).toBe('function');
        expect(typeof zustandMMKVStorage.removeItem).toBe('function');
    });
});
