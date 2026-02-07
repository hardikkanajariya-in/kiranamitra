import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, useTheme, Card, Button, Divider, Portal, Dialog, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';
import { CreditLedger } from '../components/CreditLedger';
import { useCustomerDetail } from '../hooks/useCustomers';
import { customerRepository } from '../repositories/customerRepository';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CustomerDetailScreen: React.FC<{ navigation: any; route: any }> = ({
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
    await customerRepository.deactivate(customerId);
    setShowDeleteDialog(false);
    navigation.goBack();
  };

  const handleCollectPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    await customerRepository.addCreditPayment(customerId, amount, paymentNotes);
    setShowPaymentDialog(false);
    setPaymentAmount('');
    setPaymentNotes('');
  };

  if (isLoading || !customer) {
    return <LoadingOverlay visible />;
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
              <Icon name="phone" size={20} color={theme.colors.onSurfaceVariant} />
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
                <Icon name="map-marker" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {customer.address}
                </Text>
              </View>
            ) : null}

            {customer.notes ? (
              <View style={styles.infoRow}>
                <Icon name="note-text" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {customer.notes}
                </Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>

        {/* Credit Summary */}
        <Card style={styles.creditCard} mode="elevated">
          <Card.Content>
            <View style={styles.creditHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {t('udharBalance')}
              </Text>
              <CurrencyText
                amount={outstandingCredit}
                variant="headlineSmall"
                color={outstandingCredit > 0 ? theme.colors.error : '#2E7D32'}
              />
            </View>
            {outstandingCredit > 0 ? (
              <Button
                mode="contained"
                icon="cash-plus"
                onPress={() => setShowPaymentDialog(true)}
                style={styles.collectButton}
              >
                {t('collectPayment')}
              </Button>
            ) : null}
          </Card.Content>
        </Card>

        {/* Credit Ledger */}
        <View style={styles.ledgerSection}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            {t('transactionHistory')}
          </Text>
          <CreditLedger customerId={customerId} />
        </View>
      </ScrollView>

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={showDeleteDialog}
        title={t('deleteCustomer')}
        message={t('deleteCustomerConfirm')}
        confirmLabel={t('delete')}
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
              label={t('amount')}
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="numeric"
              mode="outlined"
              left={<TextInput.Affix text="₹" />}
              style={styles.dialogInput}
            />
            <TextInput
              label={t('notes')}
              value={paymentNotes}
              onChangeText={setPaymentNotes}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPaymentDialog(false)}>{t('cancel')}</Button>
            <Button
              mode="contained"
              onPress={handleCollectPayment}
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
            >
              {t('collect')}
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
    fontWeight: 'bold',
  },
  dialogInput: {
    marginBottom: 12,
  },
});
