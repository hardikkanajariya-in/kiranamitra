import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { database } from '@core/database';
import Bill from '@core/database/models/Bill';
import Customer from '@core/database/models/Customer';
import Product from '@core/database/models/Product';
import { useSyncStore } from '@features/settings/store/useSyncStore';

const DEBOUNCE_MS = 30_000; // 30 seconds debounce

/**
 * Hook that auto-syncs the database to Google Drive when:
 * 1. Data changes (debounced 30s)
 * 2. App comes to foreground
 *
 * Mount this once in the root App component.
 */
export const useAutoSync = () => {
    const syncNow = useSyncStore((s) => s.syncNow);
    const isSignedIn = useSyncStore((s) => s.isSignedIn);
    const autoSyncEnabled = useSyncStore((s) => s.autoSyncEnabled);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounced sync trigger
    const scheduleSyncDebounced = () => {
        if (!isSignedIn || !autoSyncEnabled) { return; }

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            syncNow();
        }, DEBOUNCE_MS);
    };

    // Subscribe to table changes and trigger sync
    useEffect(() => {
        if (!isSignedIn || !autoSyncEnabled) { return; }

        const billsSub = database
            .get<Bill>('bills')
            .query()
            .observeCount()
            .subscribe(() => scheduleSyncDebounced());

        const customersSub = database
            .get<Customer>('customers')
            .query()
            .observeCount()
            .subscribe(() => scheduleSyncDebounced());

        const productsSub = database
            .get<Product>('products')
            .query()
            .observeCount()
            .subscribe(() => scheduleSyncDebounced());

        return () => {
            billsSub.unsubscribe();
            customersSub.unsubscribe();
            productsSub.unsubscribe();
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn, autoSyncEnabled]);

    // Sync when app comes to foreground
    useEffect(() => {
        if (!isSignedIn || !autoSyncEnabled) { return; }

        const handler = (state: AppStateStatus) => {
            if (state === 'active') {
                syncNow();
            }
        };

        const subscription = AppState.addEventListener('change', handler);
        return () => subscription.remove();
    }, [isSignedIn, autoSyncEnabled, syncNow]);
};
