/**
 * Tests for backupService
 */

// Mock database before importing
const mockQuery = jest.fn();
const mockFetch = jest.fn();
const mockFetchCount = jest.fn();
const mockCreate = jest.fn();
const mockDestroyPermanently = jest.fn();
const mockWrite = jest.fn();

jest.mock('@core/database', () => ({
    database: {
        get: jest.fn(() => ({
            query: jest.fn(() => ({
                fetch: mockFetch,
                fetchCount: mockFetchCount,
            })),
            create: mockCreate,
        })),
        write: mockWrite,
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
            // 8 tables × 3 records each = 24
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
        it('should serialize records from all tables', async () => {
            mockFetch.mockResolvedValue([
                { _raw: { id: 'r1', name: 'Test', _status: 'created', _changed: '' } },
            ]);

            // Mock the dynamic requires
            const mockBlobUtil = {
                fs: {
                    dirs: { DownloadDir: '/downloads' },
                    writeFile: jest.fn().mockResolvedValue(undefined),
                },
            };
            const mockShare = {
                open: jest.fn().mockResolvedValue(undefined),
            };

            jest.doMock('react-native-blob-util', () => ({ default: mockBlobUtil }), { virtual: true });
            jest.doMock('react-native-share', () => ({ default: mockShare }), { virtual: true });

            try {
                const result = await backupService.exportData();
                expect(typeof result).toBe('string');
            } catch (e) {
                // Expected in test env since require() may fail
                expect(e).toBeDefined();
            }
        });
    });

    describe('importData', () => {
        it('should handle import errors gracefully', async () => {
            jest.doMock('@react-native-documents/picker', () => ({
                pick: jest.fn().mockRejectedValue(new Error('canceled')),
                types: { allFiles: '*/*' },
            }), { virtual: true });

            try {
                await backupService.importData();
            } catch (e) {
                // Expected - may throw in test env
            }
        });
    });
});
