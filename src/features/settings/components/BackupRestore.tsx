import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, useTheme, Button, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { paperIcon } from '@shared/components/Icon';
import { backupService } from '@services/backupService';

export const BackupRestore: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation('settings');
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const filePath = await backupService.exportData();
            Alert.alert(
                t('exportSuccess'),
                t('exportSuccessDesc', { path: filePath }),
            );
        } catch (error: unknown) {
            Alert.alert(t('exportError'), (error as Error).message);
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = () => {
        Alert.alert(
            t('importWarning'),
            t('importWarningDesc'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('proceed'),
                    style: 'destructive',
                    onPress: async () => {
                        setIsImporting(true);
                        try {
                            await backupService.importData();
                            Alert.alert(t('importSuccess'), t('importSuccessDesc'));
                        } catch (error: unknown) {
                            Alert.alert(t('importError'), (error as Error).message);
                        } finally {
                            setIsImporting(false);
                        }
                    },
                },
            ],
        );
    };

    return (
        <View style={styles.container}>
            <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                {t('backupRestore')}
            </Text>

            <Card style={styles.card} mode="outlined">
                <Card.Content style={styles.cardContent}>
                    <View style={styles.infoRow}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                            {t('exportDesc')}
                        </Text>
                    </View>
                    <Button
                        mode="contained"
                        icon={paperIcon('export')}
                        onPress={handleExport}
                        loading={isExporting}
                        disabled={isExporting || isImporting}
                        style={styles.button}
                    >
                        {t('exportData')}
                    </Button>
                </Card.Content>
            </Card>

            <Card style={styles.card} mode="outlined">
                <Card.Content style={styles.cardContent}>
                    <View style={styles.infoRow}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                            {t('importDesc')}
                        </Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.error }}>
                            {t('importCaution')}
                        </Text>
                    </View>
                    <Button
                        mode="outlined"
                        icon={paperIcon('import')}
                        onPress={handleImport}
                        loading={isImporting}
                        disabled={isExporting || isImporting}
                        style={styles.button}
                    >
                        {t('importData')}
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    card: {
        marginBottom: 12,
    },
    cardContent: {
        gap: 12,
    },
    infoRow: {
        gap: 4,
    },
    button: {},
});
