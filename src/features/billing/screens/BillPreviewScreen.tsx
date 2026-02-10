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
import { BILL_STATUSES, PAYMENT_MODES } from '@core/constants';
import { Colors } from '@core/theme/colors';

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
      // Fetch customer if exists
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
      console.log('Generating PDF with data:', pdfData);
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
      case PAYMENT_MODES.CASH: return Colors.success;
      case PAYMENT_MODES.UPI: return Colors.info;
      case PAYMENT_MODES.CARD: return Colors.primary;
      case PAYMENT_MODES.CREDIT: return Colors.warning;
      default: return Colors.info;
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
        {/* Bill Header Card */}
        <Surface style={[styles.headerCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.headerTop}>
            <View style={styles.billNumberSection}>
              <Text variant="headlineSmall" style={[styles.billNumber, { color: theme.colors.onSurface }]}>
                #{bill.billNumber}
              </Text>
              <StatusBadge
                label={bill.status}
                variant={isCancelled ? 'error' : 'success'}
              />
            </View>
            <CurrencyText
              amount={bill.grandTotal}
              variant="headlineMedium"
              color={isCancelled ? theme.colors.onSurfaceVariant : Colors.success}
              style={styles.totalAmount}
            />
          </View>

          <Divider style={styles.headerDivider} />

          <View style={styles.headerDetails}>
            <View style={styles.detailItem}>
              <AppIcon name="history" size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {formatDateTime(bill.createdAt)}
              </Text>
            </View>
            <View style={[styles.paymentBadge, { backgroundColor: getPaymentColor() + '20' }]}>
              <AppIcon name={getPaymentIcon()} size={14} color={getPaymentColor()} />
              <Text style={[styles.paymentText, { color: getPaymentColor() }]}>
                {bill.paymentMode.toUpperCase()}
              </Text>
            </View>
          </View>
        </Surface>

        {/* Bill Items Card */}
        <Surface style={[styles.itemsCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.sectionHeader}>
            <AppIcon name="receipt" size={18} color={theme.colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              {t('itemsSection')} ({items.length})
            </Text>
          </View>

          {items.map((item, index) => (
            <View key={item.id}>
              {index > 0 && <Divider style={styles.itemDivider} />}
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text
                    variant="bodyLarge"
                    style={{ color: theme.colors.onSurface }}
                    numberOfLines={1}
                  >
                    {item.productName}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                  </Text>
                </View>
                <CurrencyText amount={item.total} variant="titleMedium" color={theme.colors.onSurface} />
              </View>
            </View>
          ))}
        </Surface>

        {/* Bill Summary Card */}
        <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.summaryRow}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('subtotal')}
            </Text>
            <CurrencyText amount={bill.subtotal} variant="bodyLarge" color={theme.colors.onSurfaceVariant} />
          </View>

          {bill.discountTotal > 0 && (
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge" style={{ color: Colors.success }}>
                {t('discount')}
              </Text>
              <Text variant="bodyLarge" style={{ color: Colors.success }}>
                -₹{bill.discountTotal.toFixed(2)}
              </Text>
            </View>
          )}

          <Divider style={styles.totalDivider} />

          <View style={styles.grandTotalRow}>
            <Text variant="titleLarge" style={[styles.grandTotalLabel, { color: theme.colors.onSurface }]}>
              {t('grandTotal')}
            </Text>
            <CurrencyText
              amount={bill.grandTotal}
              variant="headlineSmall"
              color={isCancelled ? theme.colors.onSurfaceVariant : Colors.primary}
              style={styles.grandTotalValue}
            />
          </View>
        </Surface>
      </ScrollView>

      <View style={[styles.bottomActions, { backgroundColor: theme.colors.background }]}>
        <Button
          mode="outlined"
          onPress={handleSharePdf}
          icon={paperIcon('file-text')}
          style={[styles.actionButton, styles.shareButton]}
          contentStyle={styles.actionButtonContent}
          loading={isGeneratingPdf}
          disabled={isGeneratingPdf}
        >
          {t('sharePdf')}
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('BillingHome')}
          icon={paperIcon('plus')}
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
        >
          {t('newBill')}
        </Button>
      </View>

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
  headerCard: {
    margin: 16,
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  billNumberSection: {
    gap: 8,
  },
  billNumber: {
    fontWeight: '700',
  },
  totalAmount: {
    fontWeight: '700',
  },
  headerDivider: {
    marginVertical: 14,
  },
  headerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemsCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
    marginRight: 12,
  },
  itemDivider: {
    opacity: 0.5,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  totalDivider: {
    marginVertical: 12,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  grandTotalLabel: {
    fontWeight: '700',
  },
  grandTotalValue: {
    fontWeight: '700',
  },
  bottomActions: {
    padding: 16,
    paddingTop: 8,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  shareButton: {
    flex: 0,
  },
  actionButtonContent: {
    paddingVertical: 6,
  },
});
