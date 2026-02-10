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
import { CREDIT_ENTRY_TYPES, CURRENCY_SYMBOL } from '@core/constants';
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
    const isAdvance = item.entryType === CREDIT_ENTRY_TYPES.ADVANCE;
    const isAdvanceUsed = item.entryType === CREDIT_ENTRY_TYPES.ADVANCE_USED;
    const isPositive = isCredit; // credit adds to outstanding
    const isNegative = !isCredit; // payment/advance/advance_used reduces

    const getLabel = () => {
      if (isCredit) return t('credit');
      if (isAdvance) return t('advance');
      if (isAdvanceUsed) return t('advanceUsed');
      return t('payment');
    };

    const getVariant = (): 'error' | 'success' | 'info' => {
      if (isCredit) return 'error';
      if (isAdvance) return 'info';
      if (isAdvanceUsed) return 'info';
      return 'success';
    };

    return (
      <View style={styles.entryRow}>
        <View style={styles.entryLeft}>
          <StatusBadge
            label={getLabel()}
            variant={getVariant()}
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
            color={isPositive ? theme.colors.error : theme.colors.primary}
            style={isNegative ? undefined : undefined}
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('balance')}: {item.balanceAfter < 0 ? '-' : ''}{CURRENCY_SYMBOL}{Math.abs(item.balanceAfter).toFixed(2)}
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
      estimatedItemSize={72}
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
