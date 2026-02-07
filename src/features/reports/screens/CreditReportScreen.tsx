import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Card, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { AppHeader } from '@shared/components/AppHeader';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { EmptyState } from '@shared/components/EmptyState';
import { reportService } from '../services/reportService';
import { CreditReportData, CustomerCreditInfo } from '@core/types';

export const CreditReportScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation('reports');
  const [report, setReport] = useState<CreditReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reportService.getCreditReport().then((data) => {
      setReport(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !report) {
    return <LoadingOverlay visible />;
  }

  const renderCustomer = ({ item }: { item: CustomerCreditInfo }) => (
    <Card style={styles.customerCard} mode="elevated">
      <Card.Content style={styles.customerRow}>
        <View style={styles.customerInfo}>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {item.phone}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('lastTransaction')}: {item.lastTransactionDate}
          </Text>
        </View>
        <CurrencyText
          amount={item.outstanding}
          variant="titleMedium"
          style={{ color: theme.colors.error }}
        />
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader
        title={t('creditReport')}
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Total Outstanding */}
        <Card style={styles.summaryCard} mode="elevated">
          <Card.Content style={styles.summaryContent}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('totalOutstanding')}
            </Text>
            <CurrencyText
              amount={report.totalOutstanding}
              variant="headlineMedium"
              style={{ color: theme.colors.error }}
            />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {report.customers.length} {t('customers')}
            </Text>
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        {/* Customer List */}
        {report.customers.length === 0 ? (
          <EmptyState
            icon="check-circle-outline"
            title={t('noOutstanding')}
            subtitle={t('noOutstandingDesc')}
          />
        ) : (
          <FlashList
            data={report.customers}
            renderItem={renderCustomer}
            keyExtractor={(item: CustomerCreditInfo) => item.id}
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
  },
  summaryCard: {
    marginBottom: 12,
  },
  summaryContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    marginBottom: 12,
  },
  customerCard: {
    marginBottom: 8,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerInfo: {
    flex: 1,
    gap: 2,
  },
  listContent: {
    paddingBottom: 16,
  },
});
