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
        t('seedComplete'),
        t('seedCompleteDesc', { categories: result.categories, products: result.products }),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : t('seedFailed');
      Alert.alert(t('seedFailed'), message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setClearConfirmVisible(false);
    setLoading(true);
    try {
      await clearAllProducts();
      Alert.alert(t('cleared'), t('clearedDesc'));
    } catch (_error) {
      Alert.alert(t('error'), t('clearFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <List.Subheader style={{ color: theme.colors.primary }}>
        {t('sampleData')}
      </List.Subheader>

      <List.Item
        title={t('loadSampleProducts')}
        description={t('loadSampleProductsDesc')}
        left={(props) => <List.Icon {...props} icon={paperIcon('database')} />}
        right={(props) => <List.Icon {...props} icon={paperIcon('chevron-right')} />}
        onPress={() => setConfirmVisible(true)}
        disabled={loading}
        style={styles.listItem}
      />

      <List.Item
        title={t('clearAllProducts')}
        description={t('clearAllProductsDesc')}
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
        title={t('loadSampleProducts')}
        message={t('loadSampleConfirm')}
        confirmLabel={t('loadLabel')}
        onConfirm={handleSeed}
        onDismiss={() => setConfirmVisible(false)}
      />

      <ConfirmDialog
        visible={clearConfirmVisible}
        title={t('clearAllProducts')}
        message={t('clearAllConfirm')}
        confirmLabel={t('clearAllLabel')}
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
