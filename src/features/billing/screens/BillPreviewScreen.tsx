import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card, Button, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { paperIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { StatusBadge } from '@shared/components/StatusBadge';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import Bill from '@core/database/models/Bill';
import BillItem from '@core/database/models/BillItem';
import { billRepository } from '../repositories/billRepository';
import { formatDateTime } from '@shared/utils/date';
import { BILL_STATUSES } from '@core/constants';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const billSub = billRepository.observeById(billId).subscribe((b) => {
      setBill(b);
      setIsLoading(false);
    });

    const itemsSub = billRepository.getBillItems(billId).subscribe(setItems);

    return () => {
      billSub.unsubscribe();
      itemsSub.unsubscribe();
    };
  }, [billId]);

  if (isLoading || !bill) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <LoadingOverlay visible />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader
        title={`${t('billNumber')} #${bill.billNumber}`}
        showBack
        onBack={() => navigation.goBack()}
        actions={[
          { icon: 'share-variant', onPress: () => {
            // Share bill details
            const billText = `${t('billNumber')} #${bill.billNumber}\n${t('common:total')}: ₹${bill.grandTotal.toFixed(2)}\n${t('common:date')}: ${formatDateTime(bill.createdAt)}`;
            import('react-native-share').then(Share => {
              Share.default.open({ message: billText }).catch(() => {});
            }).catch(() => {});
          }},
        ]}
      />

      <ScrollView style={styles.scrollView}>
        {/* Bill Header */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.headerRow}>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                #{bill.billNumber}
              </Text>
              <StatusBadge
                label={bill.status}
                variant={bill.status === BILL_STATUSES.CANCELLED ? 'error' : 'success'}
              />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {formatDateTime(bill.createdAt)}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('paymentMode')}: {bill.paymentMode.toUpperCase()}
            </Text>
          </Card.Content>
        </Card>

        {/* Bill Items */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('items')}
            </Text>
            {items.map((item, index) => (
              <View key={item.id}>
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                      {item.productName}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {item.quantity} x ₹{item.unitPrice.toFixed(2)}
                    </Text>
                  </View>
                  <CurrencyText amount={item.total} variant="bodyMedium" />
                </View>
                {index < items.length - 1 && <Divider style={styles.itemDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Bill Summary */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">{t('subtotal')}</Text>
              <CurrencyText amount={bill.subtotal} variant="bodyMedium" />
            </View>
            {bill.discountTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                  {t('discount')}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                  -₹{bill.discountTotal.toFixed(2)}
                </Text>
              </View>
            )}
            <Divider style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                {t('grandTotal')}
              </Text>
              <CurrencyText amount={bill.grandTotal} variant="titleLarge" />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.bottomActions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('BillingHome')}
          icon={paperIcon('plus')}
          style={styles.actionButton}
        >
          {t('newBill')}
        </Button>
      </View>
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
  card: {
    margin: 16,
    marginBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemDivider: {
    marginVertical: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryDivider: {
    marginVertical: 8,
  },
  bottomActions: {
    padding: 16,
  },
  actionButton: {
    width: '100%',
  },
});
