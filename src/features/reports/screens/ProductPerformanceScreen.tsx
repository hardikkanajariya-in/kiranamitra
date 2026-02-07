import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Card, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { AppHeader } from '@shared/components/AppHeader';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { DateRangePicker } from '@shared/components/DateRangePicker';
import { EmptyState } from '@shared/components/EmptyState';
import { reportService } from '../services/reportService';
import { ProductPerformanceData, DateRange } from '@core/types';
import { getDateRangeForPeriod } from '@shared/utils/date';

export const ProductPerformanceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation('reports');
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeForPeriod('thisMonth'));
  const [data, setData] = useState<ProductPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    reportService.getProductPerformance(dateRange.from, dateRange.to).then((result) => {
      setData(result);
      setIsLoading(false);
    });
  }, [dateRange]);

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);
  const totalQty = data.reduce((sum, p) => sum + p.quantitySold, 0);

  const renderProduct = ({ item, index }: { item: ProductPerformanceData; index: number }) => (
    <Card style={styles.productCard} mode="elevated">
      <Card.Content style={styles.productRow}>
        <View style={styles.rankBadge}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            #{index + 1}
          </Text>
        </View>
        <View style={styles.productInfo}>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('qtySold')}: {item.quantitySold}
          </Text>
        </View>
        <CurrencyText amount={item.revenue} variant="titleSmall" />
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader
        title={t('productPerformance')}
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onChange={(range) => setDateRange(range)}
        />

        {/* Summary */}
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard} mode="elevated">
            <Card.Content>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {t('totalRevenue')}
              </Text>
              <CurrencyText amount={totalRevenue} variant="titleMedium" />
            </Card.Content>
          </Card>
          <Card style={styles.summaryCard} mode="elevated">
            <Card.Content>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {t('totalProducts')}
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {data.length}
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.summaryCard} mode="elevated">
            <Card.Content>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {t('totalQtySold')}
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {totalQty}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Divider style={styles.divider} />

        {data.length === 0 ? (
          <EmptyState
            icon="chart-bar"
            title={t('noData')}
            subtitle={t('noDataDesc')}
          />
        ) : (
          <FlashList
            data={data}
            renderItem={renderProduct}
            estimatedItemSize={80}
            keyExtractor={(item: ProductPerformanceData) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryCard: {
    flex: 1,
  },
  divider: {},
  productCard: {
    marginBottom: 8,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  listContent: {
    paddingBottom: 16,
  },
});
