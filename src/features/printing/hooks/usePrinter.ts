import { useState, useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { bluetoothPrinterService } from '../services/BluetoothPrinterService';
import { PrintBillData } from '../services/PrinterService';
import { BluetoothDevice, PrinterConfig } from '@core/types';
import { storage } from '@core/storage/mmkv';

const PRINTER_CONFIG_KEY = 'printer_config';

export const usePrinter = () => {
    const [devices, setDevices] = useState<BluetoothDevice[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [connectedPrinter, setConnectedPrinter] = useState<PrinterConfig | null>(null);

    useEffect(() => {
        // Load saved printer config
        const saved = storage.getString(PRINTER_CONFIG_KEY);
        if (saved) {
            try {
                const config: PrinterConfig = JSON.parse(saved);
                setConnectedPrinter(config);
            } catch (_e) {
                // Ignore invalid stored config
            }
        }
    }, []);

    const requestPermissions = useCallback(async (): Promise<boolean> => {
        if (Platform.OS !== 'android') {
            return true;
        }

        try {
            const apiLevel = Platform.Version as number;

            if (apiLevel >= 31) {
                const results = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);

                return Object.values(results).every(
                    (r) => r === PermissionsAndroid.RESULTS.GRANTED,
                );
            }

            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            console.error('Permission error:', error);
            return false;
        }
    }, []);

    const scanDevices = useCallback(async () => {
        const permitted = await requestPermissions();
        if (!permitted) {
            return;
        }

        setIsScanning(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { BluetoothManager } = require('react-native-bluetooth-escpos-printer');
            const paired = await BluetoothManager.enableBluetooth();

            if (paired && Array.isArray(paired)) {
                const parsedDevices: BluetoothDevice[] = paired.map((d: string) => {
                    const parsed = JSON.parse(d);
                    return { name: parsed.name || 'Unknown', address: parsed.address };
                });
                setDevices(parsedDevices);
            }

            // Also scan for nearby devices
            try {
                const result: string = await BluetoothManager.scanDevices();
                const scanned = JSON.parse(result);
                if (scanned.found && Array.isArray(scanned.found)) {
                    const newDevices: BluetoothDevice[] = scanned.found.map((d: { name?: string; address: string }) => ({
                        name: d.name || 'Unknown',
                        address: d.address,
                    }));
                    setDevices((prev) => {
                        const existing = new Set(prev.map((p) => p.address));
                        const unique = newDevices.filter((n) => !existing.has(n.address));
                        return [...prev, ...unique];
                    });
                }
            } catch (_scanErr) {
                // Scan may fail silently
            } finally {
                setIsScanning(false);
            }
        } catch (error) {
            console.error('Scan error:', error);
            setIsScanning(false);
        }
    }, [requestPermissions]);

    const connectPrinter = useCallback(async (device: BluetoothDevice): Promise<boolean> => {
        const success = await bluetoothPrinterService.connect(device.address);
        if (success) {
            const config: PrinterConfig = {
                name: device.name,
                address: device.address,
                connected: true,
            };
            setConnectedPrinter(config);
            setIsConnected(true);
            storage.set(PRINTER_CONFIG_KEY, JSON.stringify(config));
        }
        return success;
    }, []);

    const disconnectPrinter = useCallback(async () => {
        await bluetoothPrinterService.disconnect();
        setIsConnected(false);
        setConnectedPrinter(null);
        storage.remove(PRINTER_CONFIG_KEY);
    }, []);

    const printBill = useCallback(async (data: PrintBillData) => {
        setIsPrinting(true);
        try {
            if (!bluetoothPrinterService.isConnected() && connectedPrinter) {
                await bluetoothPrinterService.connect(connectedPrinter.address);
            }
            await bluetoothPrinterService.printBill(data);
        } finally {
            setIsPrinting(false);
        }
    }, [connectedPrinter]);

    const printTest = useCallback(async () => {
        setIsPrinting(true);
        try {
            if (!bluetoothPrinterService.isConnected() && connectedPrinter) {
                await bluetoothPrinterService.connect(connectedPrinter.address);
            }
            await bluetoothPrinterService.printTestPage();
        } finally {
            setIsPrinting(false);
        }
    }, [connectedPrinter]);

    return {
        devices,
        isScanning,
        isConnected,
        isPrinting,
        connectedPrinter,
        scanDevices,
        connectPrinter,
        disconnectPrinter,
        printBill,
        printTest,
    };
};
