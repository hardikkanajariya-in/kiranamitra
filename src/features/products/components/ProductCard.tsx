import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CurrencyText } from '@shared/components/CurrencyText';
import { StatusBadge } from '@shared/components/StatusBadge';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  name: string;
  sellingPrice: number;
  currentStock: number;
  unit: string;
  isLowStock: boolean;
  isOutOfStock: boolean;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  sellingPrice,
  currentStock,
  unit,
  isLowStock,
  isOutOfStock,
  onPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('products');

  const getStockVariant = (): 'success' | 'warning' | 'error' => {
    if (isOutOfStock) return 'error';
    if (isLowStock) return 'warning';
    return 'success';
  };

  const getStockLabel = (): string => {
    if (isOutOfStock) return t('outOfStock');
    if (isLowStock) return t('lowStock');
    return `${currentStock} ${unit}`;
  };

  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.info}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }} numberOfLines={1}>
            {name}
          </Text>
          <CurrencyText amount={sellingPrice} variant="bodyLarge" />
        </View>

        <View style={styles.stockSection}>
          <StatusBadge label={getStockLabel()} variant={getStockVariant()} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  stockSection: {
    marginLeft: 12,
  },
});
