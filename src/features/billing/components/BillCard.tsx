import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { CurrencyText } from '@shared/components/CurrencyText';
import { StatusBadge } from '@shared/components/StatusBadge';
import { AppIcon } from '@shared/components/Icon';
import { formatDateTime } from '@shared/utils/date';
import { BILL_STATUSES, PAYMENT_MODES } from '@core/constants';

interface BillCardProps {
  billNumber: string;
  grandTotal: number;
  paymentMode: string;
  status: string;
  createdAt: number;
  customerName?: string;
  onPress: () => void;
}

export const BillCard: React.FC<BillCardProps> = ({
  billNumber,
  grandTotal,
  paymentMode,
  status,
  createdAt,
  customerName,
  onPress,
}) => {
  const theme = useTheme();

  const getStatusVariant = (): 'success' | 'error' | 'info' => {
    if (status === BILL_STATUSES.CANCELLED) { return 'error'; }
    return 'success';
  };

  const getPaymentIcon = (): string => {
    switch (paymentMode) {
      case PAYMENT_MODES.CASH: return 'cash';
      case PAYMENT_MODES.UPI: return 'cellphone';
      case PAYMENT_MODES.CARD: return 'credit-card';
      case PAYMENT_MODES.CREDIT: return 'account-clock';
      default: return 'cash';
    }
  };

  const getPaymentColor = (): string => {
    switch (paymentMode) {
      case PAYMENT_MODES.CASH: return theme.colors.primary;
      case PAYMENT_MODES.UPI: return theme.colors.tertiary;
      case PAYMENT_MODES.CARD: return theme.colors.secondary;
      case PAYMENT_MODES.CREDIT: return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const isCancelled = status === BILL_STATUSES.CANCELLED;

  return (
    <Pressable onPress={onPress}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        {/* Left accent strip */}
        <View style={[styles.accent, { backgroundColor: isCancelled ? theme.colors.error : getPaymentColor() }]} />

        <View style={styles.content}>
          {/* Top Row: Bill number + Amount */}
          <View style={styles.topRow}>
            <View style={styles.billInfo}>
              <Text
                variant="titleMedium"
                style={[
                  styles.billNumber,
                  { color: isCancelled ? theme.colors.onSurfaceVariant : theme.colors.onSurface },
                ]}
              >
                #{billNumber}
              </Text>
              {customerName ? (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {customerName}
                </Text>
              ) : null}
            </View>
            <CurrencyText
              amount={grandTotal}
              variant="titleMedium"
              color={isCancelled ? theme.colors.onSurfaceVariant : theme.colors.primary}
              style={styles.amount}
            />
          </View>

          {/* Bottom Row: Date + Badges */}
          <View style={styles.bottomRow}>
            <View style={styles.dateRow}>
              <AppIcon name="history" size={14} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {formatDateTime(createdAt)}
              </Text>
            </View>
            <View style={styles.badges}>
              <View style={[styles.paymentBadge, { backgroundColor: `${getPaymentColor()}1A` }]}>
                <AppIcon name={getPaymentIcon()} size={12} color={getPaymentColor()} />
                <Text variant="labelSmall" style={{ color: getPaymentColor(), fontWeight: '700' }}>
                  {paymentMode.toUpperCase()}
                </Text>
              </View>
              {isCancelled && (
                <StatusBadge label={status} variant={getStatusVariant()} compact />
              )}
            </View>
          </View>
        </View>

        {/* Chevron */}
        <View style={styles.chevron}>
          <AppIcon name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
        </View>
      </Surface>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  billInfo: {
    flex: 1,
    gap: 2,
  },
  billNumber: {
    fontWeight: '600',
  },
  amount: {
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  paymentText: {
    fontSize: 10,
    fontWeight: '700',
  },
  chevron: {
    justifyContent: 'center',
    paddingRight: 8,
  },
});
