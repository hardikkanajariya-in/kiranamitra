import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { CurrencyText } from '@shared/components/CurrencyText';
import { CartItem } from '@core/types';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.outlineVariant }]}>
      <View style={styles.info}>
        <Text variant="bodyLarge" numberOfLines={1} style={{ color: theme.colors.onSurface }}>
          {item.productName}
        </Text>
        <CurrencyText amount={item.unitPrice} variant="bodySmall" />
      </View>

      <View style={styles.quantitySection}>
        <IconButton
          icon="minus"
          size={18}
          mode="contained-tonal"
          onPress={() => onUpdateQuantity(Math.max(0.5, item.quantity - 1))}
        />
        <Text variant="titleMedium" style={styles.quantity}>
          {item.quantity}
        </Text>
        <IconButton
          icon="plus"
          size={18}
          mode="contained-tonal"
          onPress={() => onUpdateQuantity(item.quantity + 1)}
        />
      </View>

      <View style={styles.totalSection}>
        <CurrencyText amount={item.total} variant="titleSmall" />
        <IconButton
          icon="close"
          size={16}
          onPress={onRemove}
          iconColor={theme.colors.error}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantity: {
    minWidth: 28,
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
