import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Modal, Portal, Button, Card, ActivityIndicator, IconButton, List, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { paperIcon } from '@shared/components/Icon';
import { usePrinter } from '../hooks/usePrinter';
import { BluetoothDevice } from '@core/types';

interface PrinterSetupModalProps {
    visible: boolean;
    onDismiss: () => void;
}

export const PrinterSetupModal: React.FC<PrinterSetupModalProps> = ({ visible, onDismiss }) => {
    const theme = useTheme();
    const { t } = useTranslation('settings');
    const {
        devices,
        isScanning,
        isPrinting,
        connectedPrinter,
        scanDevices,
        connectPrinter,
        disconnectPrinter,
        printTest,
    } = usePrinter();

    const handleDevicePress = async (device: BluetoothDevice) => {
        await connectPrinter(device);
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
            >
                <View style={styles.header}>
                    <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                        {t('printerSetup')}
                    </Text>
                    <IconButton icon={paperIcon('close')} onPress={onDismiss} />
                </View>

                <Divider />

                <ScrollView style={styles.scrollContent}>
                    {/* Connected Printer */}
                    {connectedPrinter && (
                        <Card style={styles.connectedCard} mode="outlined">
                            <Card.Content>
                                <View style={styles.connectedRow}>
                                    <View style={styles.connectedInfo}>
                                        <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
                                            {t('connected')}
                                        </Text>
                                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                            {connectedPrinter.name}
                                        </Text>
                                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                            {connectedPrinter.address}
                                        </Text>
                                    </View>
                                    <View style={styles.connectedActions}>
                                        <Button
                                            mode="outlined"
                                            compact
                                            onPress={printTest}
                                            loading={isPrinting}
                                            disabled={isPrinting}
                                        >
                                            {t('testPrint')}
                                        </Button>
                                        <Button
                                            mode="text"
                                            compact
                                            textColor={theme.colors.error}
                                            onPress={disconnectPrinter}
                                        >
                                            {t('disconnect')}
                                        </Button>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    )}

                    {/* Scan Section */}
                    <View style={styles.scanSection}>
                        <Button
                            mode="contained"
                            icon={paperIcon('bluetooth')}
                            onPress={scanDevices}
                            loading={isScanning}
                            disabled={isScanning}
                            style={styles.scanButton}
                        >
                            {isScanning ? t('scanning') : t('scanDevices')}
                        </Button>
                    </View>

                    {/* Device List */}
                    {isScanning && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" />
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('searchingDevices')}
                            </Text>
                        </View>
                    )}

                    {devices.length > 0 && (
                        <View style={styles.deviceList}>
                            <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                                {t('availableDevices')}
                            </Text>
                            {devices.map((device) => (
                                <List.Item
                                    key={device.address}
                                    title={device.name}
                                    description={device.address}
                                    left={(props) => <List.Icon {...props} icon={paperIcon('printer')} />}}
                                    right={() =>
                                        connectedPrinter?.address === device.address ? (
                                            <Text
                                                variant="labelSmall"
                                                style={{ color: theme.colors.primary, alignSelf: 'center' }}
                                            >
                                                {t('connected')}
                                            </Text>
                                        ) : null
                                    }
                                    onPress={() => handleDevicePress(device)}
                                    disabled={connectedPrinter?.address === device.address}
                                    style={styles.deviceItem}
                                />
                            ))}
                        </View>
                    )}

                    {!isScanning && devices.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('noDevicesFound')}
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('noDevicesHint')}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 20,
        borderRadius: 12,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    scrollContent: {
        padding: 16,
    },
    connectedCard: {
        marginBottom: 16,
    },
    connectedRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    connectedInfo: {
        flex: 1,
        gap: 2,
    },
    connectedActions: {
        gap: 4,
        alignItems: 'flex-end',
    },
    scanSection: {
        marginBottom: 16,
    },
    scanButton: {
        width: '100%',
    },
    loadingContainer: {
        alignItems: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    deviceList: {
        marginTop: 8,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    deviceItem: {
        paddingVertical: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 8,
    },
});
