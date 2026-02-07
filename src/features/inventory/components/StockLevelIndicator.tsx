import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';

interface StockLevelIndicatorProps {
  currentStock: number;
  lowStockThreshold: number;
  unit: string;
}

export const StockLevelIndicator: React.FC<StockLevelIndicatorProps> = ({
  currentStock,
  lowStockThreshold,
  unit,
}) => {
  const theme = useTheme();

  const maxDisplay = Math.max(lowStockThreshold * 3, currentStock);
  const progress = maxDisplay > 0 ? Math.min(currentStock / maxDisplay, 1) : 0;

  const getColor = () => {
    if (currentStock <= 0) return theme.colors.error;
    if (currentStock <= lowStockThreshold) return '#F57C00'; // warning orange
    return '#2E7D32'; // success green
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          {currentStock} {unit}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Min: {lowStockThreshold} {unit}
        </Text>
      </View>
      <ProgressBar
        progress={progress}
        color={getColor()}
        style={[styles.bar, { backgroundColor: theme.colors.surfaceVariant }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
});
