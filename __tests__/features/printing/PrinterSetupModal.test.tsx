import React from 'react';
import { render } from '../../renderWithProviders';
import { PrinterSetupModal } from '@features/printing/components/PrinterSetupModal';

jest.mock('@features/printing/hooks/usePrinter', () => ({
    usePrinter: jest.fn(() => ({
        devices: [],
        isScanning: false,
        isConnected: false,
        isPrinting: false,
        connectedPrinter: null,
        scanDevices: jest.fn(),
        connectPrinter: jest.fn(),
        disconnectPrinter: jest.fn(),
        printTest: jest.fn(),
    })),
}));

describe('PrinterSetupModal', () => {
    it('should render when visible', () => {
        const { getByText } = render(
            <PrinterSetupModal visible onDismiss={jest.fn()} />
        );
        expect(getByText('printerSetup')).toBeTruthy();
    });

    it('should render scan button', () => {
        const { getByText } = render(
            <PrinterSetupModal visible onDismiss={jest.fn()} />
        );
        expect(getByText('scanDevices')).toBeTruthy();
    });

    it('should render empty state text', () => {
        const { getByText } = render(
            <PrinterSetupModal visible onDismiss={jest.fn()} />
        );
        expect(getByText('noDevicesFound')).toBeTruthy();
    });

    it('should not crash when not visible', () => {
        render(<PrinterSetupModal visible={false} onDismiss={jest.fn()} />);
    });
});
