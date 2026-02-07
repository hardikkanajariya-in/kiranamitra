/**
 * Tests for usePrinter hook
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { PermissionsAndroid, Platform } from 'react-native';

const mockConnect = jest.fn().mockResolvedValue(true);
const mockDisconnect = jest.fn().mockResolvedValue(undefined);
const mockIsConnected = jest.fn(() => false);
const mockPrintBill = jest.fn().mockResolvedValue(undefined);
const mockPrintTestPage = jest.fn().mockResolvedValue(undefined);

jest.mock('@features/printing/services/BluetoothPrinterService', () => ({
    bluetoothPrinterService: {
        connect: (...a: any[]) => mockConnect(...a),
        disconnect: (...a: any[]) => mockDisconnect(...a),
        isConnected: (...a: any[]) => mockIsConnected(...a),
        printBill: (...a: any[]) => mockPrintBill(...a),
        printTestPage: (...a: any[]) => mockPrintTestPage(...a),
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

// Mock BluetoothManager
const mockEnableBluetooth = jest.fn();
const mockScanDevices = jest.fn();

jest.mock('react-native-bluetooth-escpos-printer', () => ({
    BluetoothManager: {
        enableBluetooth: (...a: any[]) => mockEnableBluetooth(...a),
        scanDevices: (...a: any[]) => mockScanDevices(...a),
    },
}));

import { usePrinter } from '@features/printing/hooks/usePrinter';

describe('usePrinter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnect.mockResolvedValue(true);
        mockIsConnected.mockReturnValue(false);
    });

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
        const { storage } = require('@core/storage/mmkv');
        expect(storage.set).toHaveBeenCalled();
    });

    it('should handle failed connection', async () => {
        mockConnect.mockResolvedValue(false);
        const { result } = renderHook(() => usePrinter());
        let success: boolean | undefined;
        await act(async () => {
            success = await result.current.connectPrinter({ name: 'Printer', address: 'AA:BB' });
        });
        expect(success).toBe(false);
        expect(result.current.isConnected).toBe(false);
        expect(result.current.connectedPrinter).toBeNull();
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
        const { storage } = require('@core/storage/mmkv');
        expect(storage.remove).toHaveBeenCalled();
    });

    it('should scan for bluetooth devices', async () => {
        jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
        mockEnableBluetooth.mockResolvedValue([
            JSON.stringify({ name: 'Paired Printer', address: 'AA:BB:CC' }),
        ]);
        mockScanDevices.mockResolvedValue(JSON.stringify({ found: [] }));

        const { result } = renderHook(() => usePrinter());
        await act(async () => {
            await result.current.scanDevices();
        });
        expect(result.current.devices.length).toBeGreaterThanOrEqual(1);
        expect(result.current.devices[0].name).toBe('Paired Printer');
    });

    it('should handle scan with additional found devices', async () => {
        jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
        mockEnableBluetooth.mockResolvedValue([
            JSON.stringify({ name: 'Paired', address: 'AA:BB' }),
        ]);
        mockScanDevices.mockResolvedValue(JSON.stringify({
            found: [{ name: 'NewDevice', address: 'CC:DD' }],
        }));

        const { result } = renderHook(() => usePrinter());
        await act(async () => {
            await result.current.scanDevices();
        });
        expect(result.current.devices).toHaveLength(2);
    });

    it('should handle scan error gracefully', async () => {
        jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
        mockEnableBluetooth.mockRejectedValue(new Error('Bluetooth off'));

        const { result } = renderHook(() => usePrinter());
        await act(async () => {
            await result.current.scanDevices();
        });
        expect(result.current.isScanning).toBe(false);
    });

    it('should not scan when permission denied', async () => {
        const origOS = Platform.OS;
        (Platform as any).OS = 'android';
        jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

        const { result } = renderHook(() => usePrinter());
        await act(async () => {
            await result.current.scanDevices();
        });
        expect(mockEnableBluetooth).not.toHaveBeenCalled();
        (Platform as any).OS = origOS;
    });

    it('should print bill', async () => {
        mockIsConnected.mockReturnValue(true);
        const { result } = renderHook(() => usePrinter());
        const billData = { items: [], total: 100, billNumber: 'B001', storeName: 'Test' } as any;
        await act(async () => {
            await result.current.printBill(billData);
        });
        expect(mockPrintBill).toHaveBeenCalledWith(billData);
        expect(result.current.isPrinting).toBe(false);
    });

    it('should reconnect and print when not connected', async () => {
        const { storage } = require('@core/storage/mmkv');
        storage.getString.mockReturnValue(JSON.stringify({
            name: 'Saved Printer', address: 'XX:YY', connected: true,
        }));
        mockIsConnected.mockReturnValue(false);

        const { result } = renderHook(() => usePrinter());
        const billData = { items: [], total: 100, billNumber: 'B001', storeName: 'Test' } as any;
        await act(async () => {
            await result.current.printBill(billData);
        });
        expect(mockConnect).toHaveBeenCalledWith('XX:YY');
        expect(mockPrintBill).toHaveBeenCalledWith(billData);
    });

    it('should print test page', async () => {
        mockIsConnected.mockReturnValue(true);
        const { result } = renderHook(() => usePrinter());
        await act(async () => {
            await result.current.printTest();
        });
        expect(mockPrintTestPage).toHaveBeenCalled();
        expect(result.current.isPrinting).toBe(false);
    });

    it('should reconnect for test print when not connected', async () => {
        const { storage } = require('@core/storage/mmkv');
        storage.getString.mockReturnValue(JSON.stringify({
            name: 'Saved', address: 'XX:YY', connected: true,
        }));
        mockIsConnected.mockReturnValue(false);

        const { result } = renderHook(() => usePrinter());
        await act(async () => {
            await result.current.printTest();
        });
        expect(mockConnect).toHaveBeenCalledWith('XX:YY');
        expect(mockPrintTestPage).toHaveBeenCalled();
    });
});
