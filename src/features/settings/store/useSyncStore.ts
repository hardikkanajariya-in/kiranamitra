import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '@core/storage/zustandStorage';
import { googleDriveSync } from '@services/googleDriveSync';

interface SyncState {
    isSignedIn: boolean;
    userEmail: string | null;
    lastSyncedAt: string | null;
    isSyncing: boolean;
    autoSyncEnabled: boolean;
    syncError: string | null;

    // Actions
    initialize: () => Promise<void>;
    signIn: () => Promise<boolean>;
    signOut: () => Promise<void>;
    syncNow: () => Promise<{ success: boolean; error?: string }>;
    setAutoSync: (enabled: boolean) => void;
    clearError: () => void;
}

export const useSyncStore = create<SyncState>()(
    persist(
        (set, get) => ({
            isSignedIn: false,
            userEmail: null,
            lastSyncedAt: null,
            isSyncing: false,
            autoSyncEnabled: true,
            syncError: null,

            initialize: async () => {
                googleDriveSync.configure();
                const silentOk = await googleDriveSync.silentSignIn();
                if (silentOk) {
                    const state = googleDriveSync.getState();
                    set({
                        isSignedIn: true,
                        userEmail: state.userEmail,
                        lastSyncedAt: state.lastSyncedAt,
                    });

                    // Auto-sync on initialization if enabled
                    if (get().autoSyncEnabled) {
                        const online = await googleDriveSync.isOnline();
                        if (online) {
                            get().syncNow();
                        }
                    }
                }
            },

            signIn: async () => {
                const result = await googleDriveSync.signIn();
                if (result) {
                    set({
                        isSignedIn: true,
                        userEmail: result.email,
                        syncError: null,
                    });

                    // After sign-in, check for existing backup
                    return true;
                }
                return false;
            },

            signOut: async () => {
                await googleDriveSync.signOut();
                set({
                    isSignedIn: false,
                    userEmail: null,
                    lastSyncedAt: null,
                    syncError: null,
                });
            },

            syncNow: async () => {
                if (get().isSyncing) {
                    return { success: false, error: 'Already syncing' };
                }

                set({ isSyncing: true, syncError: null });

                const result = await googleDriveSync.sync();

                set({
                    isSyncing: false,
                    lastSyncedAt: result.success
                        ? new Date().toISOString()
                        : get().lastSyncedAt,
                    syncError: result.error || null,
                });

                return result;
            },

            setAutoSync: (enabled: boolean) => {
                set({ autoSyncEnabled: enabled });
            },

            clearError: () => {
                set({ syncError: null });
            },
        }),
        {
            name: 'sync-store',
            storage: createJSONStorage(() => zustandMMKVStorage),
            partialize: (state) => ({
                autoSyncEnabled: state.autoSyncEnabled,
                lastSyncedAt: state.lastSyncedAt,
                userEmail: state.userEmail,
                isSignedIn: state.isSignedIn,
            }),
        },
    ),
);
