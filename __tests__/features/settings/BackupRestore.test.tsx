import React from 'react';
import { render } from '../../renderWithProviders';
import { BackupRestore } from '@features/settings/components/BackupRestore';

// Mock backup service
jest.mock('@services/backupService', () => ({
    backupService: {
        exportData: jest.fn().mockResolvedValue('/path/to/backup.json'),
        importData: jest.fn().mockResolvedValue(undefined),
        getBackupInfo: jest.fn().mockResolvedValue({ totalRecords: 0, tableBreakdown: {} }),
    },
}));

describe('BackupRestore', () => {
    it('should render backup/restore title', () => {
        const { getByText } = render(<BackupRestore />);
        expect(getByText('backupRestore')).toBeTruthy();
    });

    it('should render export button', () => {
        const { getByText } = render(<BackupRestore />);
        expect(getByText('exportData')).toBeTruthy();
    });

    it('should render import button', () => {
        const { getByText } = render(<BackupRestore />);
        expect(getByText('importData')).toBeTruthy();
    });

    it('should render export description', () => {
        const { getByText } = render(<BackupRestore />);
        expect(getByText('exportDesc')).toBeTruthy();
    });

    it('should render import caution', () => {
        const { getByText } = render(<BackupRestore />);
        expect(getByText('importCaution')).toBeTruthy();
    });
});
