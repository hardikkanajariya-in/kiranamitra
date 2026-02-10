import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Text, useTheme, Card, Button, Portal, Dialog, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { paperIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';
import { CreditLedger } from '../components/CreditLedger';
import { useCustomerDetail } from '../hooks/useCustomers';
import { customerRepository } from '../repositories/customerRepository';
import { AppIcon } from '@shared/components/Icon';
import { CURRENCY_SYMBOL } from '@core/constants';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const CustomerDetailScreen: React.FC<{ navigation: NavigationProp; route: { params: { customerId: string } } }> = ({
    navigation,
    route,
}) => {
    const { customerId } = route.params;
    const theme = useTheme();
    const { t } = useTranslation('customers');
    const { customer, outstandingCredit, isLoading } = useCustomerDetail(customerId);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentNotes, setPaymentNotes] = useState('');

    const handleDelete = async () => {
        try {
            await customerRepository.deactivate(customerId);
            setShowDeleteDialog(false);
            navigation.goBack();
        } catch {
            Alert.alert(t('common:error'), t('common:operationFailed'));
        }
    };

    const handleCollectPayment = async () => {
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            return;
        }

        try {
            await customerRepository.addCreditPayment(customerId, amount, paymentNotes);
            setShowPaymentDialog(false);
            setPaymentAmount('');
            setPaymentNotes('');
        } catch {
            Alert.alert(t('common:error'), t('common:operationFailed'));
        }
    };

    if (isLoading || !customer) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
                <LoadingOverlay visible />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={customer.name}
                showBack
                onBack={() => navigation.goBack()}
                actions={[
                    { icon: 'pencil', onPress: () => navigation.navigate('CustomerForm', { customerId }) },
                    { icon: 'delete', onPress: () => setShowDeleteDialog(true) },
                ]}
            />

            <ScrollView style={styles.scrollView}>
                {/* Customer Info Card */}
                <Card style={styles.infoCard} mode="elevated">
                    <Card.Content>
                        <View style={styles.infoRow}>
                            <AppIcon name="phone" size={20} color={theme.colors.onSurfaceVariant} />
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                {customer.phone || t('noPhone')}
                            </Text>
                            {customer.phone ? (
                                <Button
                                    mode="text"
                                    compact
                                    onPress={() => Linking.openURL(`tel:${customer.phone}`)}
                                >
                                    {t('call')}
                                </Button>
                            ) : null}
                        </View>

                        {customer.address ? (
                            <View style={styles.infoRow}>
                                <AppIcon name="map-marker" size={20} color={theme.colors.onSurfaceVariant} />
                                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                    {customer.address}
                                </Text>
                            </View>
                        ) : null}

                        {customer.notes ? (
                            <View style={styles.infoRow}>
                                <AppIcon name="note-text" size={20} color={theme.colors.onSurfaceVariant} />
                                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                    {customer.notes}
                                </Text>
                            </View>
                        ) : null}
                    </Card.Content>
                </Card>

                {/* Credit / Advance Summary */}
                <Card style={styles.creditCard} mode="elevated">
                    <Card.Content>
                        <View style={styles.creditHeader}>
                            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                                {outstandingCredit > 0 ? t('outstandingCredit') : outstandingCredit < 0 ? t('advanceBalance') : t('outstandingCredit')}
                            </Text>
                            <CurrencyText
                                amount={Math.abs(outstandingCredit)}
                                variant="headlineSmall"
                                color={outstandingCredit > 0 ? theme.colors.error : outstandingCredit < 0 ? theme.colors.primary : theme.colors.onSurfaceVariant}
                            />
                        </View>
                        {outstandingCredit < 0 && (
                            <Text variant="bodySmall" style={{ color: theme.colors.primary, marginTop: 4 }}>
                                {t('advanceNote')}
                            </Text>
                        )}
                        <Button
                            mode="contained"
                            icon={paperIcon('cash-plus')}
                            onPress={() => setShowPaymentDialog(true)}
                            style={styles.collectButton}
                        >
                            {t('collectPayment')}
                        </Button>
                    </Card.Content>
                </Card>

                {/* Credit Ledger */}
                <View style={styles.ledgerSection}>
                    <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                        {t('creditHistory')}
                    </Text>
                    <CreditLedger customerId={customerId} />
                </View>
            </ScrollView>

            {/* Delete Confirmation */}
            <ConfirmDialog
                visible={showDeleteDialog}
                title={t('deleteCustomer')}
                message={t('deleteConfirm')}
                confirmLabel={t('common:delete')}
                onConfirm={handleDelete}
                onDismiss={() => setShowDeleteDialog(false)}
                destructive
            />

            {/* Payment Dialog */}
            <Portal>
                <Dialog visible={showPaymentDialog} onDismiss={() => setShowPaymentDialog(false)}>
                    <Dialog.Title>{t('collectPayment')}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label={t('common:amount')}
                            value={paymentAmount}
                            onChangeText={setPaymentAmount}
                            keyboardType="numeric"
                            mode="outlined"
                            left={<TextInput.Affix text={CURRENCY_SYMBOL} />}
                            style={styles.dialogInput}
                        />
                        <TextInput
                            label={t('common:notes')}
                            value={paymentNotes}
                            onChangeText={setPaymentNotes}
                            mode="outlined"
                            style={styles.dialogInput}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowPaymentDialog(false)}>{t('common:cancel')}</Button>
                        <Button
                            mode="contained"
                            onPress={handleCollectPayment}
                            disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                        >
                            {t('collectPayment')}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    infoCard: {
        margin: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    creditCard: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    creditHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    collectButton: {
        marginTop: 12,
    },
    ledgerSection: {
        flex: 1,
        marginBottom: 16,
    },
    sectionTitle: {
        paddingHorizontal: 16,
        marginBottom: 8,
        fontWeight: '700',
    },
    dialogInput: {
        marginBottom: 12,
    },
});
