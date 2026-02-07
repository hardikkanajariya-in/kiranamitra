import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { CurrencyText } from '@shared/components/CurrencyText';
import { StatusBadge } from '@shared/components/StatusBadge';
import CreditEntry from '@core/database/models/CreditEntry';
import { customerRepository } from '../repositories/customerRepository';
import { formatDateTime } from '@shared/utils/date';
import { CREDIT_ENTRY_TYPES } from '@core/constants';
import { EmptyState } from '@shared/components/EmptyState';

interface CreditLedgerProps {
  customerId: string;
}

export const CreditLedger: React.FC<CreditLedgerProps> = ({ customerId }) => {
  const theme = useTheme();
  const { t } = useTranslation('customers');
  const [entries, setEntries] = useState<CreditEntry[]>([]);

  useEffect(() => {
    const subscription = customerRepository
      .getCreditEntries(customerId)
      .subscribe(setEntries);

    return () => subscription.unsubscribe();
  }, [customerId]);

  const renderEntry = ({ item }: { item: CreditEntry }) => {
    const isCredit = item.entryType === CREDIT_ENTRY_TYPES.CREDIT;

    return (
      <View style={styles.entryRow}>
        <View style={styles.entryLeft}>
          <StatusBadge
            label={isCredit ? t('credit') : t('payment')}
            variant={isCredit ? 'error' : 'success'}
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {formatDateTime(item.createdAt)}
          </Text>
          {item.notes ? (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {item.notes}
            </Text>
          ) : null}
        </View>

        <View style={styles.entryRight}>
          <CurrencyText
            amount={item.amount}
            variant="titleSmall"
            color={isCredit ? theme.colors.error : theme.colors.primary}
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('balance')}: ₹{item.balanceAfter.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  if (entries.length === 0) {
    return (
      <EmptyState
        icon="history"
        title={t('noCreditHistory')}
        subtitle={t('noCreditHistorySubtitle')}
      />
    );
  }

  return (
    <FlashList
      data={entries}
      renderItem={renderEntry}
      ItemSeparatorComponent={() => <Divider />}
      keyExtractor={(item: CreditEntry) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  entryLeft: {
    flex: 1,
    gap: 4,
  },
  entryRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
});
