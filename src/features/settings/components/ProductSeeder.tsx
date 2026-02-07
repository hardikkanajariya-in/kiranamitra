import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { paperIcon } from '@shared/components/Icon';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';
import { seedProducts, clearAllProducts } from '@core/database/seeders/productSeeder';

export const ProductSeeder: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation('settings');
  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [clearConfirmVisible, setClearConfirmVisible] = useState(false);

  const handleSeed = async () => {
    setConfirmVisible(false);
    setLoading(true);
    try {
      const result = await seedProducts();
      Alert.alert(
        'Seed Complete',
        `Added ${result.categories} categories and ${result.products} products with random stock.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to seed products';
      Alert.alert('Seed Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setClearConfirmVisible(false);
    setLoading(true);
    try {
      await clearAllProducts();
      Alert.alert('Cleared', 'All products and categories have been removed.');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear products.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <List.Subheader style={{ color: theme.colors.primary }}>
        Sample Data
      </List.Subheader>

      <List.Item
        title="Load Sample Products"
        description="Add 120+ Gujarat/Saurashtra region kirana products with categories"
        left={(props) => <List.Icon {...props} icon={paperIcon('database')} />}
        right={(props) => <List.Icon {...props} icon={paperIcon('chevron-right')} />}
        onPress={() => setConfirmVisible(true)}
        disabled={loading}
        style={styles.listItem}
      />

      <List.Item
        title="Clear All Products"
        description="Remove all products and categories"
        left={(props) => (
          <List.Icon {...props} icon={paperIcon('trash-2')} color={theme.colors.error} />
        )}
        right={(props) => <List.Icon {...props} icon={paperIcon('chevron-right')} />}
        onPress={() => setClearConfirmVisible(true)}
        disabled={loading}
        style={styles.listItem}
      />

      <ConfirmDialog
        visible={confirmVisible}
        title="Load Sample Products"
        message="This will add ~120 sample kirana products with 15 categories to your database. Works only if no products exist yet. Continue?"
        confirmLabel="Load"
        onConfirm={handleSeed}
        onDismiss={() => setConfirmVisible(false)}
      />

      <ConfirmDialog
        visible={clearConfirmVisible}
        title="Clear All Products"
        message="This will permanently delete ALL products and categories. This action cannot be undone. Are you sure?"
        confirmLabel="Clear All"
        onConfirm={handleClear}
        onDismiss={() => setClearConfirmVisible(false)}
        destructive
      />
    </>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 16,
  },
});
