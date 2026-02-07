import {
    getPin,
    setPin,
    removePin,
    isPinSet,
    getLanguage,
    setLanguage,
    getThemeMode,
    setThemeMode,
    getStoreProfile,
    setStoreProfile,
    getPrinterConfig,
    setPrinterConfig,
    removePrinterConfig,
    isOnboardingDone,
    setOnboardingDone,
    getBillSequence,
    incrementBillSequence,
    getLastBillDate,
    setLastBillDate,
    resetBillSequence,
    storage,
} from '@core/storage/mmkv';
import { clearMmkvStore, mmkvStore } from '../../setup';

describe('mmkv storage', () => {
    beforeEach(() => {
        clearMmkvStore();
    });

    describe('PIN operations', () => {
        it('should return null when no pin is set', () => {
            expect(getPin()).toBeNull();
        });

        it('should set and get pin', () => {
            setPin('hashed-pin');
            expect(getPin()).toBe('hashed-pin');
        });

        it('should remove pin', () => {
            setPin('hashed-pin');
            removePin();
            expect(getPin()).toBeNull();
        });

        it('should check if pin is set', () => {
            expect(isPinSet()).toBe(false);
            setPin('hashed-pin');
            expect(isPinSet()).toBe(true);
        });
    });

    describe('Language operations', () => {
        it('should default to "en"', () => {
            expect(getLanguage()).toBe('en');
        });

        it('should set and get language', () => {
            setLanguage('hi');
            expect(getLanguage()).toBe('hi');
        });
    });

    describe('Theme operations', () => {
        it('should default to "system"', () => {
            expect(getThemeMode()).toBe('system');
        });

        it('should set and get theme mode', () => {
            setThemeMode('dark');
            expect(getThemeMode()).toBe('dark');
        });
    });

    describe('Store Profile operations', () => {
        it('should return default profile when none set', () => {
            const profile = getStoreProfile();
            expect(profile.name).toBe('My Kirana Store');
            expect(profile.address).toBe('');
        });

        it('should set and get profile', () => {
            setStoreProfile({
                name: 'Test Store',
                address: '123 Street',
                phone: '9876543210',
                gstNumber: 'GST123',
            });
            const profile = getStoreProfile();
            expect(profile.name).toBe('Test Store');
            expect(profile.phone).toBe('9876543210');
        });

        it('should return default on invalid JSON', () => {
            storage.set('store_profile', 'invalid-json');
            const profile = getStoreProfile();
            expect(profile.name).toBe('My Kirana Store');
        });
    });

    describe('Printer Config operations', () => {
        it('should return null when no config set', () => {
            expect(getPrinterConfig()).toBeNull();
        });

        it('should set and get printer config', () => {
            setPrinterConfig({ name: 'Printer1', address: 'AA:BB:CC', connected: false });
            const config = getPrinterConfig();
            expect(config?.name).toBe('Printer1');
        });

        it('should remove printer config', () => {
            setPrinterConfig({ name: 'Printer1', address: 'AA:BB:CC', connected: false });
            removePrinterConfig();
            expect(getPrinterConfig()).toBeNull();
        });

        it('should return null on invalid JSON', () => {
            storage.set('printer_config', 'not-json');
            expect(getPrinterConfig()).toBeNull();
        });
    });

    describe('Onboarding operations', () => {
        it('should default to false', () => {
            expect(isOnboardingDone()).toBe(false);
        });

        it('should set onboarding done', () => {
            setOnboardingDone();
            expect(isOnboardingDone()).toBe(true);
        });
    });

    describe('Bill Sequence operations', () => {
        it('should default to 0', () => {
            expect(getBillSequence()).toBe(0);
        });

        it('should increment sequence', () => {
            const seq1 = incrementBillSequence();
            expect(seq1).toBe(1);
            const seq2 = incrementBillSequence();
            expect(seq2).toBe(2);
        });

        it('should reset sequence', () => {
            incrementBillSequence();
            incrementBillSequence();
            resetBillSequence();
            expect(getBillSequence()).toBe(0);
        });
    });

    describe('Bill Date operations', () => {
        it('should default to empty string', () => {
            expect(getLastBillDate()).toBe('');
        });

        it('should set and get last bill date', () => {
            setLastBillDate('240115');
            expect(getLastBillDate()).toBe('240115');
        });
    });
});
