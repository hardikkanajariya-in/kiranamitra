import React from 'react';
import { render, fireEvent, waitFor } from '../../renderWithProviders';
import { BackupRestore } from '@features/settings/components/BackupRestore';
import { Alert } from 'react-native';

const mockExportData = jest.fn().mockResolvedValue('/path/to/backup.json');
const mockImportData = jest.fn().mockResolvedValue(undefined);

jest.mock('@services/backupService', () => ({
    backupService: {
        exportData: (...args: any[]) => mockExportData(...args),
        importData: (...args: any[]) => mockImportData(...args),
        getBackupInfo: jest.fn().mockResolvedValue({ totalRecords: 0, tableBreakdown: {} }),
    },
}));

jest.spyOn(Alert, 'alert');

describe('BackupRestore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockExportData.mockResolvedValue('/path/to/backup.json');
        mockImportData.mockResolvedValue(undefined);
    });

    it('should render backup/restore title and buttons', () => {
        const { getByText } = render(<BackupRestore />);
        expect(getByText('backupRestore')).toBeTruthy();
        expect(getByText('exportData')).toBeTruthy();
        expect(getByText('importData')).toBeTruthy();
        expect(getByText('exportDesc')).toBeTruthy();
        expect(getByText('importCaution')).toBeTruthy();
    });

    it('should handle export success', async () => {
        const { getByText } = render(<BackupRestore />);
        fireEvent.press(getByText('exportData'));
        await waitFor(() => {
            expect(mockExportData).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith(
                'exportSuccess',
                expect.any(String),
            );
        });
    });

    it('should handle export error', async () => {
        mockExportData.mockRejectedValue(new Error('Export failed'));
        const { getByText } = render(<BackupRestore />);
        fireEvent.press(getByText('exportData'));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('exportError', 'Export failed');
        });
    });

    it('should show import confirmation dialog', () => {
        const { getByText } = render(<BackupRestore />);
        fireEvent.press(getByText('importData'));
        expect(Alert.alert).toHaveBeenCalledWith(
            'importWarning',
            'importWarningDesc',
            expect.arrayContaining([
                expect.objectContaining({ text: 'cancel' }),
                expect.objectContaining({ text: 'proceed' }),
            ]),
        );
    });

    it('should handle import success when user proceeds', async () => {
        const { getByText } = render(<BackupRestore />);
        fireEvent.press(getByText('importData'));
        // Get the proceed callback from the Alert.alert call
        const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
        const proceedButton = alertCall[2][1];
        await proceedButton.onPress();
        await waitFor(() => {
            expect(mockImportData).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith('importSuccess', 'importSuccessDesc');
        });
    });

    it('should handle import error when user proceeds', async () => {
        mockImportData.mockRejectedValue(new Error('Import failed'));
        const { getByText } = render(<BackupRestore />);
        fireEvent.press(getByText('importData'));
        const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
        const proceedButton = alertCall[2][1];
        await proceedButton.onPress();
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('importError', 'Import failed');
        });
    });
});
