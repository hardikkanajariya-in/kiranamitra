import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, useTheme, Card, Button, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { CurrencyText } from '@shared/components/CurrencyText';
import { StatusBadge } from '@shared/components/StatusBadge';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';
import { useProductDetail } from '../hooks/useProducts';
import { productRepository } from '../repositories/productRepository';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const ProductDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { productId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('products');
  const { product, isLoading } = useProductDetail(productId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await productRepository.deactivate(productId);
      setShowDeleteDialog(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('common:error'), t('common:operationFailed'));
    }
  };

  if (isLoading || !product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <LoadingOverlay visible />
      </SafeAreaView>
    );
  }

  const profitMargin = product.purchasePrice > 0
    ? ((product.sellingPrice - product.purchasePrice) / product.purchasePrice * 100).toFixed(1)
    : '0';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader
        title={product.name}
        showBack
        onBack={() => navigation.goBack()}
        actions={[
          { icon: 'pencil', onPress: () => navigation.navigate('ProductForm', { productId }) },
          { icon: 'delete', onPress: () => setShowDeleteDialog(true) },
        ]}
      />

      <ScrollView style={styles.scrollView}>
        {/* Pricing Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('pricing')}
            </Text>
            <View style={styles.priceRow}>
              <View style={styles.priceItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('purchasePrice')}
                </Text>
                <CurrencyText amount={product.purchasePrice} variant="titleLarge" />
              </View>
              <View style={styles.priceItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('sellingPrice')}
                </Text>
                <CurrencyText amount={product.sellingPrice} variant="titleLarge" />
              </View>
              <View style={styles.priceItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('margin')}
                </Text>
                <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
                  {profitMargin}%
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Stock Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.stockHeader}>
              <Text variant="titleMedium">{t('stock')}</Text>
              <StatusBadge
                label={
                  product.isOutOfStock
                    ? t('outOfStock')
                    : product.isLowStock
                    ? t('lowStock')
                    : t('inStock')
                }
                variant={product.isOutOfStock ? 'error' : product.isLowStock ? 'warning' : 'success'}
              />
            </View>

            <View style={styles.stockInfo}>
              <View style={styles.stockItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('currentStock')}
                </Text>
                <Text variant="headlineMedium">
                  {product.currentStock} {product.unit}
                </Text>
              </View>
              <View style={styles.stockItem}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('threshold')}
                </Text>
                <Text variant="headlineMedium">
                  {product.lowStockThreshold} {product.unit}
                </Text>
              </View>
            </View>

            <Button
              mode="outlined"
              icon="plus-minus"
              onPress={() => navigation.navigate('StockAdjustment', { productId })}
              style={styles.adjustButton}
            >
              {t('adjustStock')}
            </Button>
          </Card.Content>
        </Card>

        {/* Details Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('details')}
            </Text>
            <View style={styles.detailRow}>
              <Icon name="tag" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium">{t('unit')}: {product.unit}</Text>
            </View>
            {product.barcode ? (
              <View style={styles.detailRow}>
                <Icon name="barcode" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyMedium">{product.barcode}</Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>
      </ScrollView>

      <ConfirmDialog
        visible={showDeleteDialog}
        title={t('deleteProduct')}
        message={t('deleteProductConfirm')}
        confirmLabel={t('delete')}
        onConfirm={handleDelete}
        onDismiss={() => setShowDeleteDialog(false)}
        destructive
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceItem: {
    alignItems: 'center',
    gap: 4,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stockItem: {
    alignItems: 'center',
    gap: 4,
  },
  adjustButton: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
});
