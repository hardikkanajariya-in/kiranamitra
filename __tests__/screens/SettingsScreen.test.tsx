import React from 'react';
import { render } from '../renderWithProviders';

jest.mock('@features/settings/store/useSettingsStore', () => ({
    useSettingsStore: jest.fn(() => ({
        isDarkMode: false,
        setDarkMode: jest.fn(),
        language: 'en',
        setLanguage: jest.fn(),
        storeProfile: { name: 'Test Store', address: '', phone: '', gstNumber: '' },
        setStoreProfile: jest.fn(),
    })),
}));
jest.mock('@features/auth/store/useAuthStore', () => ({
    useAuthStore: jest.fn(() => ({
        verifyAndLogin: jest.fn(),
        changePin: jest.fn(),
    })),
}));
jest.mock('@services/backupService', () => ({
    backupService: {
        exportData: jest.fn(),
        importData: jest.fn(),
    },
}));
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

import { SettingsScreen } from '@features/settings/screens/SettingsScreen';

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

describe('SettingsScreen', () => {
    it('should render settings screen', () => {
        render(<SettingsScreen navigation={mockNavigation} />);
    });
});
