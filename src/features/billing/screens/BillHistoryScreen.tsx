import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { SearchInput } from '@shared/components/SearchInput';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { BillCard } from '../components/BillCard';
import { billRepository } from '../repositories/billRepository';
import Bill from '@core/database/models/Bill';
import { useDebounce } from '@shared/hooks/useDebounce';

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

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader title={t('billHistory')} />

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('searchBillPlaceholder')}
      />

      {bills.length === 0 ? (
        <EmptyState
          icon="receipt"
          title={t('noBills')}
          subtitle={t('noBillsSubtitle')}
        />
      ) : (
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
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
});
