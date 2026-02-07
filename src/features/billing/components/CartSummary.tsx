import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { CurrencyText } from '@shared/components/CurrencyText';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  grandTotal: number;
  itemCount: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discount,
  grandTotal,
  itemCount,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('billing');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      <View style={styles.row}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('subtotal')} ({itemCount} {t('items')})
        </Text>
        <CurrencyText amount={subtotal} variant="bodyMedium" />
      </View>

      {discount > 0 && (
        <View style={styles.row}>
          <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
            {t('discount')}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
            - ₹{discount.toFixed(2)}
          </Text>
        </View>
      )}

      <Divider style={styles.divider} />

      <View style={styles.row}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
          {t('grandTotal')}
        </Text>
        <CurrencyText amount={grandTotal} variant="titleLarge" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 8,
  },
});
