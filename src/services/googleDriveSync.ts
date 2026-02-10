import { database } from '@core/database';
import { Q } from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import { storage } from '@core/storage/mmkv';

// ── Types ──
interface BackupData {
    version: number;
    createdAt: string;
    appVersion: string;
    tables: Record<string, Record<string, unknown>[]>;
}

interface SyncState {
    lastSyncedAt: string | null;
    isSignedIn: boolean;
    userEmail: string | null;
    isSyncing: boolean;
}

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

const BACKUP_FILENAME = 'kiranamitra_backup.json';
const SYNC_STATE_KEY = 'google_drive_sync_state';

// ── Helpers ──
const serializeRecord = (record: { _raw: Record<string, unknown> }): Record<string, unknown> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _status, _changed, ...data } = record._raw;
    return data;
};

const getSyncState = (): SyncState => {
    const raw = storage.getString(SYNC_STATE_KEY);
    if (!raw) {
        return { lastSyncedAt: null, isSignedIn: false, userEmail: null, isSyncing: false };
    }
    try {
        return JSON.parse(raw) as SyncState;
    } catch {
        return { lastSyncedAt: null, isSignedIn: false, userEmail: null, isSyncing: false };
    }
};

const setSyncState = (state: Partial<SyncState>) => {
    const current = getSyncState();
    storage.set(SYNC_STATE_KEY, JSON.stringify({ ...current, ...state }));
};

// Lazy imports to avoid crashes if packages aren't installed yet
const getGoogleSignIn = () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { GoogleSignin, statusCodes } = require('@react-native-google-signin/google-signin');
        return { GoogleSignin, statusCodes };
    } catch {
        return null;
    }
};

const getGDrive = () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { GDrive } = require('@robinbobin/react-native-google-drive-api-wrapper');
        return GDrive;
    } catch {
        return null;
    }
};

const getNetInfo = () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('@react-native-community/netinfo').default;
    } catch {
        return null;
    }
};

// ── Google Drive Service ──
export const googleDriveSync = {
    /**
     * Configure Google Sign-In. Call once at app startup.
     */
    configure: () => {
        const gsModule = getGoogleSignIn();
        if (!gsModule) { return; }
        gsModule.GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.appdata'],
            offlineAccess: false,
            webClientId: '417628752587-8p730kdrcs78pp1b1qokv7mpq839s9n5.apps.googleusercontent.com'
        });
    },

    /**
     * Sign in to Google silently (if previously signed in) or show sign-in prompt.
     */
    signIn: async (): Promise<{ email: string } | null> => {
        const gsModule = getGoogleSignIn();
        if (!gsModule) { return null; }
        const { GoogleSignin } = gsModule;

        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            console.log('[GoogleDriveSync] signIn response:', JSON.stringify(response));
            const user = response?.data?.user;
            if (user?.email) {
                setSyncState({ isSignedIn: true, userEmail: user.email });
                return { email: user.email };
            }
            return null;
        } catch (error: unknown) {
            console.error('[GoogleDriveSync] signIn error:', error);
            return null;
        }
    },

    /**
     * Try silent sign-in (no UI prompt).
     */
    silentSignIn: async (): Promise<boolean> => {
        const gsModule = getGoogleSignIn();
        if (!gsModule) { return false; }
        const { GoogleSignin } = gsModule;

        try {
            const response = await GoogleSignin.signInSilently();
            const user = response?.data?.user;
            if (user?.email) {
                setSyncState({ isSignedIn: true, userEmail: user.email });
                return true;
            }
            return false;
        } catch {
            return false;
        }
    },

    /**
     * Sign out from Google.
     */
    signOut: async () => {
        const gsModule = getGoogleSignIn();
        if (!gsModule) { return; }
        try {
            await gsModule.GoogleSignin.signOut();
        } catch {
            // Ignore sign-out errors
        }
        setSyncState({ isSignedIn: false, userEmail: null, lastSyncedAt: null });
    },

    /**
     * Check if user is signed in.
     */
    isSignedIn: (): boolean => {
        return getSyncState().isSignedIn;
    },

    /**
     * Get current sync state.
     */
    getState: getSyncState,

    /**
     * Check if device has internet connection.
     */
    isOnline: async (): Promise<boolean> => {
        const NetInfo = getNetInfo();
        if (!NetInfo) { return false; }
        try {
            const state = await NetInfo.fetch();
            return state.isConnected === true;
        } catch {
            return false;
        }
    },

    /**
     * Export entire database to a JSON backup.
     */
    exportDatabase: async (): Promise<string> => {
        const backup: BackupData = {
            version: 1,
            createdAt: dayjs().toISOString(),
            appVersion: '1.0.0',
            tables: {},
        };

        for (const tableName of TABLE_NAMES) {
            const collection = database.get(tableName);
            const records = await collection.query().fetch();
            backup.tables[tableName] = records.map(serializeRecord);
        }

        return JSON.stringify(backup);
    },

    /**
     * Upload backup JSON to Google Drive appData folder.
     */
    uploadToDrive: async (jsonContent: string): Promise<boolean> => {
        const gsModule = getGoogleSignIn();
        const GDriveClass = getGDrive();
        if (!gsModule || !GDriveClass) { return false; }

        try {
            const tokens = await gsModule.GoogleSignin.getTokens();
            const gdrive = new GDriveClass();
            gdrive.accessToken = tokens.accessToken;

            // Search for existing backup file in appDataFolder
            const list = await gdrive.files.list({
                q: `name='${BACKUP_FILENAME}' and trashed=false`,
                spaces: 'appDataFolder',
                fields: 'files(id, name)',
            });

            const existingFile = list?.files?.[0];

            if (existingFile?.id) {
                // Update existing file
                await gdrive.files.newMultipartUploader()
                    .setIdOfFileToUpdate(existingFile.id)
                    .setData(jsonContent, 'application/json')
                    .execute();
            } else {
                // Create new file
                await gdrive.files.newMultipartUploader()
                    .setData(jsonContent, 'application/json')
                    .setRequestBody({
                        name: BACKUP_FILENAME,
                        parents: ['appDataFolder'],
                    })
                    .execute();
            }

            setSyncState({ lastSyncedAt: dayjs().toISOString() });
            return true;
        } catch (error) {
            console.error('Google Drive upload error:', error);
            return false;
        }
    },

    /**
     * Download backup JSON from Google Drive.
     */
    downloadFromDrive: async (): Promise<BackupData | null> => {
        const gsModule = getGoogleSignIn();
        const GDriveClass = getGDrive();
        if (!gsModule || !GDriveClass) { return null; }

        try {
            const tokens = await gsModule.GoogleSignin.getTokens();
            const gdrive = new GDriveClass();
            gdrive.accessToken = tokens.accessToken;

            // Find the backup file
            const list = await gdrive.files.list({
                q: `name='${BACKUP_FILENAME}' and trashed=false`,
                spaces: 'appDataFolder',
                fields: 'files(id, name, modifiedTime)',
            });

            const file = list?.files?.[0];
            if (!file?.id) { return null; }

            // Download file content
            const content = await gdrive.files.getJson(file.id);
            if (content && content.version && content.tables) {
                return content as BackupData;
            }
            return null;
        } catch (error) {
            console.error('Google Drive download error:', error);
            return null;
        }
    },

    /**
     * Check if a backup exists on Google Drive.
     */
    checkExistingBackup: async (): Promise<{ exists: boolean; createdAt?: string }> => {
        const backup = await googleDriveSync.downloadFromDrive();
        if (backup) {
            return { exists: true, createdAt: backup.createdAt };
        }
        return { exists: false };
    },

    /**
     * Restore database from a backup.
     */
    restoreFromBackup: async (backup: BackupData): Promise<void> => {
        if (!backup.version || !backup.tables) {
            throw new Error('Invalid backup data');
        }

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
                        Object.keys(rawData).forEach((key) => {
                            if (key !== 'id') {
                                try {
                                    rec._raw[key] = rawData[key];
                                } catch {
                                    // Some fields may not be writable
                                }
                            }
                        });
                        rec._raw.id = rawData.id;
                    });
                }
            }
        });
    },

    /**
     * Perform a full sync cycle: export DB → upload to Drive.
     * Only syncs if online and signed in.
     */
    sync: async (): Promise<{ success: boolean; error?: string }> => {
        const state = getSyncState();
        if (!state.isSignedIn) {
            return { success: false, error: 'Not signed in' };
        }

        const online = await googleDriveSync.isOnline();
        if (!online) {
            return { success: false, error: 'No internet connection' };
        }

        setSyncState({ isSyncing: true });

        try {
            const jsonContent = await googleDriveSync.exportDatabase();
            const uploaded = await googleDriveSync.uploadToDrive(jsonContent);

            setSyncState({ isSyncing: false });

            if (uploaded) {
                return { success: true };
            }
            return { success: false, error: 'Upload failed' };
        } catch (error) {
            setSyncState({ isSyncing: false });
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Sync failed',
            };
        }
    },
};
