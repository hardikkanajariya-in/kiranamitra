import { hashPin, verifyPin } from '@shared/utils/hash';

describe('hash utils', () => {
  it('should hash a PIN string', () => {
    const hash = hashPin('1234');
    expect(hash).toBeDefined();
    expect(hash.length).toBeGreaterThan(0);
    expect(hash).not.toBe('1234');
  });

  it('should produce consistent hashes', () => {
    const hash1 = hashPin('1234');
    const hash2 = hashPin('1234');
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different PINs', () => {
    const hash1 = hashPin('1234');
    const hash2 = hashPin('5678');
    expect(hash1).not.toBe(hash2);
  });

  it('should verify correct PIN against hash', () => {
    const hash = hashPin('1234');
    expect(verifyPin('1234', hash)).toBe(true);
  });

  it('should reject incorrect PIN against hash', () => {
    const hash = hashPin('1234');
    expect(verifyPin('5678', hash)).toBe(false);
  });
});
