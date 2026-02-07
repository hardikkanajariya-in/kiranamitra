import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@shared/components/Icon';
import { useTranslation } from 'react-i18next';
import { CurrencyText } from '@shared/components/CurrencyText';

interface SalesSummaryCardProps {
  todaySales: number;
  todayBillCount: number;
  monthSales: number;
}

export const SalesSummaryCard: React.FC<SalesSummaryCardProps> = ({
  todaySales,
  todayBillCount,
  monthSales,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('dashboard');

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.header}>
          <AppIcon name="chart-line" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {t('salesSummary')}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('todaySales')}
            </Text>
            <CurrencyText amount={todaySales} variant="headlineSmall" />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('billCount', { count: todayBillCount })}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

          <View style={styles.stat}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('monthSales')}
            </Text>
            <CurrencyText amount={monthSales} variant="headlineSmall" />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 48,
    marginHorizontal: 8,
  },
});
