/**
 * Tests for usePrinter hook
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';

jest.mock('@features/printing/services/BluetoothPrinterService', () => ({
    bluetoothPrinterService: {
        connect: jest.fn().mockResolvedValue(true),
        disconnect: jest.fn().mockResolvedValue(undefined),
        isConnected: jest.fn(() => false),
        printBill: jest.fn().mockResolvedValue(undefined),
        printTestPage: jest.fn().mockResolvedValue(undefined),
    },
}));

jest.mock('@core/storage/mmkv', () => ({
    storage: {
        getString: jest.fn(() => undefined),
        set: jest.fn(),
        remove: jest.fn(),
    },
    getLanguage: jest.fn(() => 'en'),
    setLanguage: jest.fn(),
    getPin: jest.fn(),
    setPin: jest.fn(),
    hasCompletedOnboarding: jest.fn(() => false),
    setOnboardingComplete: jest.fn(),
}));

import { usePrinter } from '@features/printing/hooks/usePrinter';

describe('usePrinter', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should initialize with default state', () => {
        const { result } = renderHook(() => usePrinter());
        expect(result.current.devices).toEqual([]);
        expect(result.current.isScanning).toBe(false);
        expect(result.current.isConnected).toBe(false);
        expect(result.current.isPrinting).toBe(false);
        expect(result.current.connectedPrinter).toBeNull();
    });

    it('should load saved printer config on mount', () => {
        const { storage } = require('@core/storage/mmkv');
        storage.getString.mockReturnValue(JSON.stringify({
            name: 'Test Printer',
            address: 'AA:BB:CC:DD:EE',
            connected: true,
        }));

        const { result } = renderHook(() => usePrinter());
        expect(result.current.connectedPrinter).toEqual({
            name: 'Test Printer',
            address: 'AA:BB:CC:DD:EE',
            connected: true,
        });
    });

    it('should handle invalid saved config gracefully', () => {
        const { storage } = require('@core/storage/mmkv');
        storage.getString.mockReturnValue('invalid json');
        const { result } = renderHook(() => usePrinter());
        expect(result.current.connectedPrinter).toBeNull();
    });

    it('should connect printer and save config', async () => {
        const { result } = renderHook(() => usePrinter());
        let success: boolean | undefined;
        await act(async () => {
            success = await result.current.connectPrinter({ name: 'My Printer', address: 'AA:BB' });
        });
        expect(success).toBe(true);
        expect(result.current.isConnected).toBe(true);
        expect(result.current.connectedPrinter?.name).toBe('My Printer');
    });

    it('should disconnect printer', async () => {
        const { result } = renderHook(() => usePrinter());
        await act(async () => {
            await result.current.connectPrinter({ name: 'Printer', address: 'AA:BB' });
        });
        await act(async () => {
            await result.current.disconnectPrinter();
        });
        expect(result.current.isConnected).toBe(false);
        expect(result.current.connectedPrinter).toBeNull();
    });

    it('should have scanDevices function', () => {
        const { result } = renderHook(() => usePrinter());
        expect(typeof result.current.scanDevices).toBe('function');
    });

    it('should have printBill function', () => {
        const { result } = renderHook(() => usePrinter());
        expect(typeof result.current.printBill).toBe('function');
    });

    it('should have printTest function', () => {
        const { result } = renderHook(() => usePrinter());
        expect(typeof result.current.printTest).toBe('function');
    });
});
