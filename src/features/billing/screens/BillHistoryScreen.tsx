import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Text, Surface } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { SearchInput } from '@shared/components/SearchInput';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { AppIcon } from '@shared/components/Icon';
import { BillCard } from '../components/BillCard';
import { billRepository } from '../repositories/billRepository';
import Bill from '@core/database/models/Bill';
import { useDebounce } from '@shared/hooks/useDebounce';
import { formatCurrency } from '@shared/utils/currency';
import { Colors } from '@core/theme/colors';
import dayjs from 'dayjs';

interface BillHistoryScreenProps {
  navigation: { navigate: (screen: string, params?: Record<string, unknown>) => void; goBack: () => void };
}

export const BillHistoryScreen: React.FC<BillHistoryScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation('billing');
  const [searchQuery, setSearchQuery] = useState('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const observable = debouncedSearch
      ? billRepository.searchByBillNumber(debouncedSearch)
      : billRepository.observeAll();

    const subscription = observable.subscribe((result) => {
      setBills(result);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [debouncedSearch]);

  // Calculate today's stats
  const todayStats = useMemo(() => {
    const today = dayjs().startOf('day');
    const todayBills = bills.filter(bill => dayjs(bill.createdAt).isAfter(today));
    const todayTotal = todayBills.reduce((sum, bill) => sum + bill.grandTotal, 0);
    return { count: todayBills.length, total: todayTotal };
  }, [bills]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader title={t('billHistory')} showBack onBack={() => navigation.goBack()} />

      {isLoading ? (
        <LoadingOverlay visible />
      ) : (
        <>
          {/* Today's Summary */}
          <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <View style={styles.summaryItem}>
              <AppIcon name="receipt" size={20} color={Colors.primary} />
              <View>
                <Text variant="titleLarge" style={[styles.summaryValue, { color: theme.colors.onSurface }]}>
                  {todayStats.count}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('todayBills')}
                </Text>
              </View>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.colors.outlineVariant }]} />
            <View style={styles.summaryItem}>
              <AppIcon name="cash" size={20} color={Colors.success} />
              <View>
                <Text variant="titleLarge" style={[styles.summaryValue, { color: Colors.success }]}>
                  {formatCurrency(todayStats.total)}
                </Text>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('todaySales')}
                </Text>
              </View>
            </View>
          </Surface>

          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchBills')}
          />

          {bills.length === 0 ? (
            <EmptyState
              icon="receipt"
              title={t('noBills')}
              subtitle={t('noBillsSubtitle')}
            />
          ) : (
            <View style={styles.listContainer}>
              <View style={styles.listHeader}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {bills.length} {t('billsFound')}
                </Text>
              </View>
              <FlashList
                data={bills}
                renderItem={({ item }: { item: Bill }) => (
                  <BillCard
                    billNumber={item.billNumber}
                    grandTotal={item.grandTotal}
                    paymentMode={item.paymentMode}
                    status={item.status}
                    createdAt={item.createdAt.getTime()}
                    onPress={() => navigation.navigate('BillPreview', { billId: item.id })}
                  />
                )}
                keyExtractor={(item: Bill) => item.id}
                estimatedItemSize={90}
                contentContainerStyle={styles.listContent}
              />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryValue: {
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 12,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
});
