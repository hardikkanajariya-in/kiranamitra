import { database } from '@core/database';
import dayjs from 'dayjs';

// Table name → model mapping
const TABLE_NAMES = [
    'customers',
    'categories',
    'products',
    'inventory_logs',
    'bills',
    'bill_items',
    'payments',
    'credit_entries',
] as const;

interface BackupData {
    version: number;
    createdAt: string;
    tables: Record<string, Record<string, unknown>[]>;
}

const serializeRecord = (record: { _raw: Record<string, unknown> }): Record<string, unknown> => {
    const raw = record._raw;
    // Remove WatermelonDB internal fields
    const { _status: _, _changed: __, ...data } = raw;
    return data;
};

export const backupService = {
    exportData: async (): Promise<string> => {
        const backup: BackupData = {
            version: 1,
            createdAt: dayjs().toISOString(),
            tables: {},
        };

        for (const tableName of TABLE_NAMES) {
            const collection = database.get(tableName);
            const records = await collection.query().fetch();
            backup.tables[tableName] = records.map(serializeRecord);
        }

        // Generate JSON
        const jsonContent = JSON.stringify(backup, null, 2);

        try {
            // Use react-native-share to share the exported file
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const ReactNativeBlobUtil = require('react-native-blob-util').default;
            const fileName = `kiranamitra_backup_${dayjs().format('YYYY-MM-DD_HH-mm')}.json`;
            const filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${fileName}`;

            await ReactNativeBlobUtil.fs.writeFile(filePath, jsonContent, 'utf8');

            // Share via system share sheet
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const Share = require('react-native-share').default;
            await Share.open({
                url: `file://${filePath}`,
                type: 'application/json',
                title: 'KiranaMitra Backup',
                filename: fileName,
            });

            return filePath;
        } catch (error: unknown) {
            if ((error as Error).message?.includes('User did not share')) {
                // User cancelled share, but file was still saved
                return 'File saved to Downloads';
            }
            throw error;
        }
    },

    importData: async (): Promise<void> => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { pick, types } = require('@react-native-documents/picker');
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const ReactNativeBlobUtil = require('react-native-blob-util').default;

            const [result] = await pick({
                type: [types.allFiles],
            });

            if (!result.uri) {
                throw new Error('No file selected');
            }

            // Read file content
            let filePath = result.uri;
            // Handle content:// URIs on Android
            if (filePath.startsWith('content://')) {
                const destPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/import_temp.json`;
                await ReactNativeBlobUtil.fs.cp(filePath, destPath);
                filePath = destPath;
            }

            const content = await ReactNativeBlobUtil.fs.readFile(filePath, 'utf8');
            const backup: BackupData = JSON.parse(content);

            // Validate backup structure
            if (!backup.version || !backup.tables) {
                throw new Error('Invalid backup file format');
            }

            // Import data
            await database.write(async () => {
                // Clear existing data in reverse dependency order
                for (const tableName of [...TABLE_NAMES].reverse()) {
                    const collection = database.get(tableName);
                    const existing = await collection.query().fetch();
                    for (const record of existing) {
                        await record.destroyPermanently();
                    }
                }

                // Import in dependency order
                for (const tableName of TABLE_NAMES) {
                    const records = backup.tables[tableName];
                    if (!records || !Array.isArray(records)) {
                        continue;
                    }

                    const collection = database.get(tableName);

                    for (const rawData of records) {
                        await collection.create((rec: { _raw: Record<string, unknown> }) => {
                            // Copy all fields from backup
                            Object.keys(rawData).forEach((key) => {
                                if (key !== 'id') {
                                    try {
                                        rec._raw[key] = rawData[key];
                                    } catch (_e) {
                                        // Some fields may not be writable
                                    }
                                }
                            });
                            // Set the original ID
                            rec._raw.id = rawData.id;
                        });
                    }
                }
            });
        } catch (error: unknown) {
            if ((error as Error)?.message?.includes('canceled') || (error as Error)?.message?.includes('cancelled')) {
                // User cancelled picker
                return;
            }
            throw error;
        }
    },

    getBackupInfo: async (): Promise<{
        totalRecords: number;
        tableBreakdown: Record<string, number>;
    }> => {
        const tableBreakdown: Record<string, number> = {};
        let totalRecords = 0;

        for (const tableName of TABLE_NAMES) {
            const collection = database.get(tableName);
            const count = await collection.query().fetchCount();
            tableBreakdown[tableName] = count;
            totalRecords += count;
        }

        return { totalRecords, tableBreakdown };
    },
};
