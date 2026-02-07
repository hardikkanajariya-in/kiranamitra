import { createHash } from 'react-native-quick-crypto';

const SALT = 'KiranaMitra_v1_salt';

/**
 * Hash a PIN using SHA-256 via react-native-quick-crypto (C++ TurboModule).
 * Drop-in replacement for the old CryptoJS.SHA256 call — same output format.
 */
export const hashPin = (pin: string): string =>
    createHash('sha256')
        .update(pin + SALT)
        .digest('hex');

export const verifyPin = (pin: string, storedHash: string): boolean => {
    const hash = hashPin(pin);
    return hash === storedHash;
};
