import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { CurrencyText } from '@shared/components/CurrencyText';
import { StatusBadge } from '@shared/components/StatusBadge';
import { formatDateTime } from '@shared/utils/date';
import { BILL_STATUSES } from '@core/constants';

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

  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.left}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            #{billNumber}
          </Text>
          {customerName ? (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {customerName}
            </Text>
          ) : null}
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {formatDateTime(createdAt)}
          </Text>
        </View>

        <View style={styles.right}>
          <CurrencyText
            amount={grandTotal}
            variant="titleMedium"
            color={status === BILL_STATUSES.CANCELLED ? theme.colors.onSurfaceVariant : undefined}
          />
          <View style={styles.badges}>
            <StatusBadge label={paymentMode.toUpperCase()} variant="info" />
            <StatusBadge label={status} variant={getStatusVariant()} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    gap: 4,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
});
