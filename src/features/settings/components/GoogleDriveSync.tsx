import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, useTheme, Button, Card, Switch, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { paperIcon, AppIcon } from '@shared/components/Icon';
import { useSyncStore } from '../store/useSyncStore';
import { googleDriveSync } from '@services/googleDriveSync';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const GoogleDriveSync: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation('settings');
    const {
        isSignedIn,
        userEmail,
        lastSyncedAt,
        isSyncing,
        autoSyncEnabled,
        syncError,
        signIn,
        signOut,
        syncNow,
        setAutoSync,
    } = useSyncStore();

    const [isCheckingBackup, setIsCheckingBackup] = useState(false);

    const handleSignIn = async () => {
        const success = await signIn();
        if (!success) {
            Alert.alert(t('syncSignInFailed'), t('syncSignInFailedDesc'));
            return;
        }

        // Check for existing backup
        setIsCheckingBackup(true);
        try {
            const { exists, createdAt } = await googleDriveSync.checkExistingBackup();
            setIsCheckingBackup(false);

            if (exists) {
                const formattedDate = createdAt
                    ? dayjs(createdAt).format('DD/MM/YYYY hh:mm A')
                    : '';

                Alert.alert(
                    t('existingBackupFound'),
                    t('existingBackupFoundDesc', { date: formattedDate }),
                    [
                        {
                            text: t('restoreBackup'),
                            onPress: handleRestore,
                        },
                        {
                            text: t('startFresh'),
                            style: 'destructive',
                            onPress: () => {
                                // Just sync current data to Drive (overwrite)
                                syncNow();
                            },
                        },
                        {
                            text: t('cancel'),
                            style: 'cancel',
                        },
                    ],
                );
            } else {
                // No existing backup, just sync
                syncNow();
            }
        } catch {
            setIsCheckingBackup(false);
        }
    };

    const handleRestore = async () => {
        try {
            const backup = await googleDriveSync.downloadFromDrive();
            if (backup) {
                await googleDriveSync.restoreFromBackup(backup);
                Alert.alert(t('restoreSuccess'), t('restoreSuccessDesc'));
            }
        } catch (error) {
            Alert.alert(
                t('restoreFailed'),
                error instanceof Error ? error.message : t('common:operationFailed'),
            );
        }
    };

    const handleSignOut = () => {
        Alert.alert(
            t('syncSignOut'),
            t('syncSignOutDesc'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('syncSignOut'),
                    style: 'destructive',
                    onPress: signOut,
                },
            ],
        );
    };

    const handleManualSync = async () => {
        const result = await syncNow();
        if (result.success) {
            Alert.alert(t('syncSuccess'), t('syncSuccessDesc'));
        } else if (result.error) {
            Alert.alert(t('syncFailed'), result.error);
        }
    };

    const getLastSyncedLabel = () => {
        if (!lastSyncedAt) { return t('neverSynced'); }
        return dayjs(lastSyncedAt).fromNow();
    };

    return (
        <View style={styles.container}>
            <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                {t('googleDriveSync')}
            </Text>

            {!isSignedIn ? (
                <Card style={styles.card} mode="outlined">
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.iconRow}>
                            <AppIcon name="cloud" size={32} color={theme.colors.primary} />
                            <View style={styles.descriptionContainer}>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                    {t('syncDescription')}
                                </Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {t('syncDescriptionDetail')}
                                </Text>
                            </View>
                        </View>
                        <Button
                            mode="contained"
                            icon={paperIcon('log-in')}
                            onPress={handleSignIn}
                            loading={isCheckingBackup}
                            disabled={isCheckingBackup}
                            style={styles.signInButton}
                        >
                            {t('signInWithGoogle')}
                        </Button>
                    </Card.Content>
                </Card>
            ) : (
                <>
                    {/* Account Info Card */}
                    <Card style={styles.card} mode="outlined">
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.accountRow}>
                                <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
                                    <AppIcon name="user" size={20} color={theme.colors.onPrimaryContainer} />
                                </View>
                                <View style={styles.accountInfo}>
                                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                        {userEmail}
                                    </Text>
                                    <View style={styles.statusRow}>
                                        {isSyncing ? (
                                            <ActivityIndicator size={12} color={theme.colors.primary} />
                                        ) : (
                                            <AppIcon
                                                name="check-circle"
                                                size={14}
                                                color={syncError ? theme.colors.error : theme.colors.primary}
                                            />
                                        )}
                                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                            {isSyncing
                                                ? t('syncing')
                                                : syncError
                                                    ? t('syncFailed')
                                                    : `${t('lastSynced')}: ${getLastSyncedLabel()}`}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {syncError && (
                                <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: 8 }}>
                                    {syncError}
                                </Text>
                            )}
                        </Card.Content>
                    </Card>

                    {/* Sync Controls */}
                    <Card style={styles.card} mode="outlined">
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.switchRow}>
                                <View style={styles.switchLabel}>
                                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                        {t('autoSync')}
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                        {t('autoSyncDesc')}
                                    </Text>
                                </View>
                                <Switch value={autoSyncEnabled} onValueChange={setAutoSync} />
                            </View>

                            <View style={styles.buttonRow}>
                                <Button
                                    mode="outlined"
                                    icon={paperIcon('refresh-cw')}
                                    onPress={handleManualSync}
                                    loading={isSyncing}
                                    disabled={isSyncing}
                                    style={styles.flexButton}
                                >
                                    {t('syncNow')}
                                </Button>
                                <Button
                                    mode="text"
                                    icon={paperIcon('log-out')}
                                    onPress={handleSignOut}
                                    textColor={theme.colors.error}
                                >
                                    {t('syncSignOut')}
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontWeight: '700',
        marginBottom: 12,
    },
    card: {
        marginBottom: 12,
    },
    cardContent: {
        gap: 12,
    },
    iconRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    descriptionContainer: {
        flex: 1,
        gap: 4,
    },
    signInButton: {
        marginTop: 4,
    },
    accountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountInfo: {
        flex: 1,
        gap: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    switchLabel: {
        flex: 1,
        gap: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flexButton: {
        flex: 1,
    },
});
