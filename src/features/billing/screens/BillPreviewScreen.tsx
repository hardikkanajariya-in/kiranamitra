import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, useTheme, Button, Divider, Surface } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { AppIcon, paperIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { StatusBadge } from '@shared/components/StatusBadge';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import Bill from '@core/database/models/Bill';
import BillItem from '@core/database/models/BillItem';
import Customer from '@core/database/models/Customer';
import { billRepository } from '../repositories/billRepository';
import { billPdfService, BillPdfData } from '../services/billPdfService';
import { useSettingsStore } from '@features/settings/store/useSettingsStore';
import { formatDateTime } from '@shared/utils/date';
import { BILL_STATUSES, PAYMENT_MODES, CURRENCY_SYMBOL } from '@core/constants';

interface BillPreviewScreenProps {
  navigation: { navigate: (screen: string, params?: Record<string, unknown>) => void; goBack: () => void };
  route: { params: { billId: string } };
}

export const BillPreviewScreen: React.FC<BillPreviewScreenProps> = ({
  navigation,
  route,
}) => {
  const { billId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('billing');
  const [bill, setBill] = useState<Bill | null>(null);
  const [items, setItems] = useState<BillItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const storeProfile = useSettingsStore((state) => state.storeProfile);

  useEffect(() => {
    const billSub = billRepository.observeById(billId).subscribe(async (b) => {
      setBill(b);
      setIsLoading(false);
      if (b?.customerId) {
        try {
          const cust = await b.customer.fetch();
          setCustomer(cust);
        } catch {
          setCustomer(null);
        }
      }
    });

    const itemsSub = billRepository.getBillItems(billId).subscribe(setItems);

    return () => {
      billSub.unsubscribe();
      itemsSub.unsubscribe();
    };
  }, [billId]);

  const preparePdfData = (): BillPdfData | null => {
    if (!bill) return null;

    return {
      storeName: storeProfile.name,
      storeAddress: storeProfile.address,
      storePhone: storeProfile.phone,
      gstNumber: storeProfile.gstNumber,
      billNumber: bill.billNumber,
      createdAt: bill.createdAt,
      items: items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      subtotal: bill.subtotal,
      discountTotal: bill.discountTotal,
      grandTotal: bill.grandTotal,
      paymentMode: bill.paymentMode,
      customerName: customer?.name,
      customerPhone: customer?.phone,
      status: bill.status,
    };
  };

  const handleSharePdf = async () => {
    const pdfData = preparePdfData();
    if (!pdfData) return;

    setIsGeneratingPdf(true);
    try {
      await billPdfService.sharePdf(pdfData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('common:error');
      Alert.alert(t('common:error'), errorMessage);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading || !bill) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <LoadingOverlay visible />
      </SafeAreaView>
    );
  }

  const getPaymentIcon = (): string => {
    switch (bill.paymentMode) {
      case PAYMENT_MODES.CASH: return 'cash';
      case PAYMENT_MODES.UPI: return 'cellphone';
      case PAYMENT_MODES.CARD: return 'credit-card';
      case PAYMENT_MODES.CREDIT: return 'account-clock';
      default: return 'cash';
    }
  };

  const getPaymentColor = (): string => {
    switch (bill.paymentMode) {
      case PAYMENT_MODES.CASH: return theme.colors.primary;
      case PAYMENT_MODES.UPI: return theme.colors.tertiary;
      case PAYMENT_MODES.CARD: return theme.colors.secondary;
      case PAYMENT_MODES.CREDIT: return theme.colors.error;
      default: return theme.colors.tertiary;
    }
  };

  const getPaymentLabel = (): string => {
    switch (bill.paymentMode) {
      case PAYMENT_MODES.CASH: return t('cash');
      case PAYMENT_MODES.UPI: return t('upi');
      case PAYMENT_MODES.CARD: return t('card');
      case PAYMENT_MODES.CREDIT: return t('credit');
      default: return bill.paymentMode;
    }
  };

  const isCancelled = bill.status === BILL_STATUSES.CANCELLED;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader
        title={`${t('billNumber')} #${bill.billNumber}`}
        showBack
        onBack={() => navigation.goBack()}
        actions={[
          { icon: 'share-variant', onPress: handleSharePdf },
        ]}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Grand Total Hero */}
        <Surface
          style={[
            styles.heroCard,
            {
              backgroundColor: isCancelled
                ? theme.colors.errorContainer
                : theme.colors.primaryContainer,
            },
          ]}
          elevation={0}
        >
          <StatusBadge
            label={bill.status}
            variant={isCancelled ? 'error' : 'success'}
          />
          <CurrencyText
            amount={bill.grandTotal}
            variant="displaySmall"
            color={isCancelled ? theme.colors.onErrorContainer : theme.colors.onPrimaryContainer}
            style={isCancelled ? styles.cancelledAmount : undefined}
          />
          <Text
            variant="bodyMedium"
            style={{ color: isCancelled ? theme.colors.onErrorContainer : theme.colors.onPrimaryContainer, opacity: 0.8 }}
          >
            #{bill.billNumber}
          </Text>
        </Surface>

        {/* Meta Info Row */}
        <View style={styles.metaRow}>
          <View style={[styles.metaChip, { backgroundColor: theme.colors.surfaceVariant }]}>
            <AppIcon name="history" size={14} color={theme.colors.onSurfaceVariant} />
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {formatDateTime(bill.createdAt)}
            </Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: getPaymentColor() + '18' }]}>
            <AppIcon name={getPaymentIcon()} size={14} color={getPaymentColor()} />
            <Text variant="labelMedium" style={{ color: getPaymentColor(), fontWeight: '600' }}>
              {getPaymentLabel()}
            </Text>
          </View>
        </View>

        {/* Customer Card */}
        {customer && (
          <Surface style={[styles.customerCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <View style={styles.customerRow}>
              <View style={[styles.customerAvatar, { backgroundColor: theme.colors.secondaryContainer }]}>
                <AppIcon name="user" size={18} color={theme.colors.onSecondaryContainer} />
              </View>
              <View style={styles.customerInfo}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                  {customer.name}
                </Text>
                {customer.phone ? (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {customer.phone}
                  </Text>
                ) : null}
              </View>
            </View>
          </Surface>
        )}

        {/* Items Card */}
        <Surface style={[styles.itemsCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
          {/* Table Header */}
          <View style={[styles.tableHeader, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="labelSmall" style={[styles.colHash, { color: theme.colors.onPrimaryContainer }]}>
              #
            </Text>
            <Text variant="labelSmall" style={[styles.colItem, { color: theme.colors.onPrimaryContainer }]}>
              {t('itemsSection').toUpperCase()}
            </Text>
            <Text variant="labelSmall" style={[styles.colQty, { color: theme.colors.onPrimaryContainer }]}>
              {t('quantity').toUpperCase()}
            </Text>
            <Text variant="labelSmall" style={[styles.colRate, { color: theme.colors.onPrimaryContainer }]}>
              {t('price').toUpperCase()}
            </Text>
            <Text variant="labelSmall" style={[styles.colAmount, { color: theme.colors.onPrimaryContainer }]}>
              {t('total').toUpperCase()}
            </Text>
          </View>

          {/* Item Rows */}
          {items.map((item, index) => (
            <View key={item.id}>
              {index > 0 && <Divider style={styles.itemDivider} />}
              <View style={styles.tableRow}>
                <Text variant="bodySmall" style={[styles.colHash, { color: theme.colors.onSurfaceVariant }]}>
                  {index + 1}
                </Text>
                <View style={styles.colItem}>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurface }}
                    numberOfLines={2}
                  >
                    {item.productName}
                  </Text>
                </View>
                <Text variant="bodyMedium" style={[styles.colQty, { color: theme.colors.onSurface }]}>
                  {item.quantity}
                </Text>
                <Text variant="bodySmall" style={[styles.colRate, { color: theme.colors.onSurfaceVariant }]}>
                  {CURRENCY_SYMBOL}{item.unitPrice.toFixed(0)}
                </Text>
                <Text variant="titleSmall" style={[styles.colAmount, { color: theme.colors.onSurface }]}>
                  {CURRENCY_SYMBOL}{item.total.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}

          {/* Summary inside items card */}
          <View style={[styles.summarySection, { borderTopColor: theme.colors.outlineVariant }]}>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {t('subtotal')} ({items.length} {items.length === 1 ? 'item' : 'items'})
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {CURRENCY_SYMBOL}{bill.subtotal.toFixed(2)}
              </Text>
            </View>

            {bill.discountTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                  {t('discount')}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                  -{CURRENCY_SYMBOL}{bill.discountTotal.toFixed(2)}
                </Text>
              </View>
            )}

            <Divider style={styles.totalDivider} />

            <View style={styles.grandTotalRow}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                {t('grandTotal')}
              </Text>
              <CurrencyText
                amount={bill.grandTotal}
                variant="titleLarge"
                color={isCancelled ? theme.colors.onSurfaceVariant : theme.colors.primary}
                style={styles.grandTotalValue}
              />
            </View>
          </View>
        </Surface>

        <View style={styles.scrollPadding} />
      </ScrollView>

      {/* Bottom Actions */}
      <Surface style={[styles.bottomActions, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <Button
          mode="outlined"
          onPress={handleSharePdf}
          icon={paperIcon('file-text')}
          style={styles.shareButton}
          contentStyle={styles.buttonContent}
          loading={isGeneratingPdf}
          disabled={isGeneratingPdf}
        >
          {t('sharePdf')}
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('BillingHome')}
          icon={paperIcon('plus')}
          style={styles.newBillButton}
          contentStyle={styles.buttonContent}
        >
          {t('newBill')}
        </Button>
      </Surface>

      <LoadingOverlay visible={isGeneratingPdf} />
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
  scrollPadding: {
    height: 8,
  },

  // Hero
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  cancelledAmount: {
    textDecorationLine: 'line-through',
  },

  // Meta chips
  metaRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },

  // Customer
  customerCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInfo: {
    flex: 1,
    gap: 2,
  },

  // Items table
  itemsCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  colHash: {
    width: 24,
    textAlign: 'center',
  },
  colItem: {
    flex: 1,
    paddingHorizontal: 6,
  },
  colQty: {
    width: 36,
    textAlign: 'center',
  },
  colRate: {
    width: 56,
    textAlign: 'right',
  },
  colAmount: {
    width: 72,
    textAlign: 'right',
    fontWeight: '600',
  },
  itemDivider: {
    marginHorizontal: 14,
    opacity: 0.5,
  },

  // Summary
  summarySection: {
    borderTopWidth: 1,
    marginHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalDivider: {
    marginVertical: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  grandTotalValue: {
    fontWeight: '700',
  },

  // Bottom actions
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  shareButton: {
    flex: 1,
    borderRadius: 10,
  },
  newBillButton: {
    flex: 1,
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 4,
  },
});
