import React from 'react';
import { render, fireEvent } from '../../renderWithProviders';
import { PrinterSetupModal } from '@features/printing/components/PrinterSetupModal';

const mockScanDevices = jest.fn();
const mockConnectPrinter = jest.fn().mockResolvedValue(true);
const mockDisconnectPrinter = jest.fn().mockResolvedValue(undefined);
const mockPrintTest = jest.fn().mockResolvedValue(undefined);
const mockUsePrinter = jest.fn();

jest.mock('@features/printing/hooks/usePrinter', () => ({
    usePrinter: () => mockUsePrinter(),
}));

describe('PrinterSetupModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUsePrinter.mockReturnValue({
            devices: [],
            isScanning: false,
            isConnected: false,
            isPrinting: false,
            connectedPrinter: null,
            scanDevices: mockScanDevices,
            connectPrinter: mockConnectPrinter,
            disconnectPrinter: mockDisconnectPrinter,
            printTest: mockPrintTest,
        });
    });

    it('should render when visible', () => {
        const { getByText } = render(
            <PrinterSetupModal visible onDismiss={jest.fn()} />
        );
        expect(getByText('printerSetup')).toBeTruthy();
    });

    it('should render scan button and call scanDevices', () => {
        const { getByText } = render(
            <PrinterSetupModal visible onDismiss={jest.fn()} />
        );
        fireEvent.press(getByText('scanDevices'));
        expect(mockScanDevices).toHaveBeenCalled();
    });

    it('should render empty state text', () => {
        const { getByText } = render(
            <PrinterSetupModal visible onDismiss={jest.fn()} />
        );
        expect(getByText('noDevicesFound')).toBeTruthy();
        expect(getByText('noDevicesHint')).toBeTruthy();
    });

    it('should show scanning state', () => {
        mockUsePrinter.mockReturnValue({
            devices: [], isScanning: true, isConnected: false, isPrinting: false,
            connectedPrinter: null, scanDevices: mockScanDevices,
            connectPrinter: mockConnectPrinter, disconnectPrinter: mockDisconnectPrinter, printTest: mockPrintTest,
        });
        const { getByText } = render(<PrinterSetupModal visible onDismiss={jest.fn()} />);
        expect(getByText('scanning')).toBeTruthy();
        expect(getByText('searchingDevices')).toBeTruthy();
    });

    it('should show device list', () => {
        mockUsePrinter.mockReturnValue({
            devices: [{ name: 'Printer A', address: 'AA:BB' }, { name: 'Printer B', address: 'CC:DD' }],
            isScanning: false, isConnected: false, isPrinting: false,
            connectedPrinter: null, scanDevices: mockScanDevices,
            connectPrinter: mockConnectPrinter, disconnectPrinter: mockDisconnectPrinter, printTest: mockPrintTest,
        });
        const { getByText } = render(<PrinterSetupModal visible onDismiss={jest.fn()} />);
        expect(getByText('availableDevices')).toBeTruthy();
        expect(getByText('Printer A')).toBeTruthy();
        expect(getByText('Printer B')).toBeTruthy();
    });

    it('should show connected printer with disconnect and test print', () => {
        mockUsePrinter.mockReturnValue({
            devices: [], isScanning: false, isConnected: true, isPrinting: false,
            connectedPrinter: { name: 'My Printer', address: 'XX:YY', connected: true },
            scanDevices: mockScanDevices, connectPrinter: mockConnectPrinter,
            disconnectPrinter: mockDisconnectPrinter, printTest: mockPrintTest,
        });
        const { getByText } = render(<PrinterSetupModal visible onDismiss={jest.fn()} />);
        expect(getByText('connected')).toBeTruthy();
        expect(getByText('My Printer')).toBeTruthy();
        fireEvent.press(getByText('disconnect'));
        expect(mockDisconnectPrinter).toHaveBeenCalled();
    });

    it('should call test print', () => {
        mockUsePrinter.mockReturnValue({
            devices: [], isScanning: false, isConnected: true, isPrinting: false,
            connectedPrinter: { name: 'Printer', address: 'XX:YY', connected: true },
            scanDevices: mockScanDevices, connectPrinter: mockConnectPrinter,
            disconnectPrinter: mockDisconnectPrinter, printTest: mockPrintTest,
        });
        const { getByText } = render(<PrinterSetupModal visible onDismiss={jest.fn()} />);
        fireEvent.press(getByText('testPrint'));
        expect(mockPrintTest).toHaveBeenCalled();
    });

    it('should not crash when not visible', () => {
        render(<PrinterSetupModal visible={false} onDismiss={jest.fn()} />);
    });
});
