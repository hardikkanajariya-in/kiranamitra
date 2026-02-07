/**
 * Tests for backupService
 */

const mockFetch = jest.fn();
const mockFetchCount = jest.fn();
const mockCreate = jest.fn();
const mockDestroyPermanently = jest.fn();
const mockWrite = jest.fn();

jest.mock('@core/database', () => ({
    database: {
        get: jest.fn(() => ({
            query: jest.fn(() => ({
                fetch: (...a: any[]) => mockFetch(...a),
                fetchCount: (...a: any[]) => mockFetchCount(...a),
            })),
            create: (...a: any[]) => mockCreate(...a),
        })),
        write: (...a: any[]) => mockWrite(...a),
    },
}));

jest.mock('dayjs', () => {
    const actual = jest.requireActual('dayjs');
    return actual;
});

import { backupService } from '@services/backupService';

describe('backupService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockResolvedValue([]);
        mockFetchCount.mockResolvedValue(0);
        mockWrite.mockImplementation(async (fn: any) => fn());
    });

    describe('getBackupInfo', () => {
        it('should return total records and table breakdown', async () => {
            mockFetchCount.mockResolvedValue(5);
            const result = await backupService.getBackupInfo();
            expect(result).toHaveProperty('totalRecords');
            expect(result).toHaveProperty('tableBreakdown');
            expect(typeof result.totalRecords).toBe('number');
        });

        it('should count records for all 8 tables', async () => {
            mockFetchCount.mockResolvedValue(3);
            const result = await backupService.getBackupInfo();
            expect(result.totalRecords).toBe(24);
            expect(Object.keys(result.tableBreakdown)).toHaveLength(8);
        });

        it('should handle empty tables', async () => {
            mockFetchCount.mockResolvedValue(0);
            const result = await backupService.getBackupInfo();
            expect(result.totalRecords).toBe(0);
        });
    });

    describe('exportData', () => {
        it('should export records and write file', async () => {
            mockFetch.mockResolvedValue([
                { _raw: { id: 'r1', name: 'Test', _status: 'created', _changed: '' } },
            ]);

            const BlobUtil = require('react-native-blob-util').default;
            BlobUtil.fs.writeFile.mockResolvedValue(undefined);
            const Share = require('react-native-share').default;
            Share.open.mockResolvedValue(undefined);

            const result = await backupService.exportData();
            expect(BlobUtil.fs.writeFile).toHaveBeenCalled();
            expect(Share.open).toHaveBeenCalled();
            expect(typeof result).toBe('string');
            expect(result).toContain('/mock/downloads/');
        });

        it('should strip _status and _changed from serialized records', async () => {
            mockFetch.mockResolvedValue([
                { _raw: { id: 'r1', name: 'Test', _status: 'created', _changed: '' } },
            ]);

            const BlobUtil = require('react-native-blob-util').default;
            BlobUtil.fs.writeFile.mockResolvedValue(undefined);
            const Share = require('react-native-share').default;
            Share.open.mockResolvedValue(undefined);

            await backupService.exportData();
            const writeCall = BlobUtil.fs.writeFile.mock.calls[0];
            const content = JSON.parse(writeCall[1]);
            // Check first table's first record doesn't have internal fields
            const firstTable = Object.keys(content.tables)[0];
            if (content.tables[firstTable].length > 0) {
                expect(content.tables[firstTable][0]).not.toHaveProperty('_status');
                expect(content.tables[firstTable][0]).not.toHaveProperty('_changed');
                expect(content.tables[firstTable][0]).toHaveProperty('id', 'r1');
            }
        });

        it('should handle user did not share gracefully', async () => {
            mockFetch.mockResolvedValue([]);
            const BlobUtil = require('react-native-blob-util').default;
            BlobUtil.fs.writeFile.mockResolvedValue(undefined);
            const Share = require('react-native-share').default;
            Share.open.mockRejectedValue(new Error('User did not share'));

            const result = await backupService.exportData();
            expect(result).toBe('File saved to Downloads');
        });

        it('should re-throw other errors', async () => {
            mockFetch.mockResolvedValue([]);
            const BlobUtil = require('react-native-blob-util').default;
            BlobUtil.fs.writeFile.mockRejectedValue(new Error('Disk full'));

            await expect(backupService.exportData()).rejects.toThrow('Disk full');
        });
    });

    describe('importData', () => {
        it('should import data from valid backup file', async () => {
            const backupContent = JSON.stringify({
                version: 1,
                createdAt: '2024-01-01T00:00:00.000Z',
                tables: {
                    customers: [{ id: 'c1', name: 'Test Customer' }],
                    categories: [],
                    products: [],
                    inventory_logs: [],
                    bills: [],
                    bill_items: [],
                    payments: [],
                    credit_entries: [],
                },
            });

            const picker = require('@react-native-documents/picker');
            picker.pick.mockResolvedValue([{ uri: '/mock/backup.json' }]);

            const BlobUtil = require('react-native-blob-util').default;
            BlobUtil.fs.readFile.mockResolvedValue(backupContent);

            mockFetch.mockResolvedValue([]);
            mockCreate.mockImplementation((fn: any) => {
                const rec = { _raw: {} as Record<string, unknown> };
                fn(rec);
                return rec;
            });

            await backupService.importData();
            expect(picker.pick).toHaveBeenCalled();
            expect(BlobUtil.fs.readFile).toHaveBeenCalled();
            expect(mockWrite).toHaveBeenCalled();
            expect(mockCreate).toHaveBeenCalled();
        });

        it('should handle content:// URIs on Android', async () => {
            const backupContent = JSON.stringify({
                version: 1,
                createdAt: '2024-01-01',
                tables: { customers: [], categories: [], products: [], inventory_logs: [], bills: [], bill_items: [], payments: [], credit_entries: [] },
            });

            const picker = require('@react-native-documents/picker');
            picker.pick.mockResolvedValue([{ uri: 'content://com.android/file' }]);

            const BlobUtil = require('react-native-blob-util').default;
            BlobUtil.fs.cp.mockResolvedValue(undefined);
            BlobUtil.fs.readFile.mockResolvedValue(backupContent);
            mockFetch.mockResolvedValue([]);

            await backupService.importData();
            expect(BlobUtil.fs.cp).toHaveBeenCalledWith('content://com.android/file', '/mock/cache/import_temp.json');
        });

        it('should handle canceled picker gracefully', async () => {
            const picker = require('@react-native-documents/picker');
            picker.pick.mockRejectedValue(new Error('User canceled'));

            // Should not throw
            await backupService.importData();
        });

        it('should throw on invalid backup format', async () => {
            const picker = require('@react-native-documents/picker');
            picker.pick.mockResolvedValue([{ uri: '/mock/file.json' }]);

            const BlobUtil = require('react-native-blob-util').default;
            BlobUtil.fs.readFile.mockResolvedValue(JSON.stringify({ invalid: true }));

            await expect(backupService.importData()).rejects.toThrow('Invalid backup file format');
        });

        it('should delete existing records before importing', async () => {
            const existingRecord = { destroyPermanently: mockDestroyPermanently };
            mockFetch.mockResolvedValue([existingRecord]);

            const backupContent = JSON.stringify({
                version: 1,
                createdAt: '2024-01-01',
                tables: { customers: [], categories: [], products: [], inventory_logs: [], bills: [], bill_items: [], payments: [], credit_entries: [] },
            });

            const picker = require('@react-native-documents/picker');
            picker.pick.mockResolvedValue([{ uri: '/mock/backup.json' }]);

            const BlobUtil = require('react-native-blob-util').default;
            BlobUtil.fs.readFile.mockResolvedValue(backupContent);

            await backupService.importData();
            expect(mockDestroyPermanently).toHaveBeenCalled();
        });
    });
});
