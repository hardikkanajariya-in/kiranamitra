import React from 'react';
import { StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, Button, SegmentedButtons, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppHeader } from '@shared/components/AppHeader';
import { FormField } from '@shared/components/FormField';
import { stockAdjustmentSchema, StockAdjustmentFormData } from '../schemas/productSchema';
import { productRepository } from '../repositories/productRepository';
import { useProductDetail } from '../hooks/useProducts';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { STOCK_REASONS } from '@core/constants';

export const StockAdjustmentScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { productId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('inventory');
  const { product, isLoading } = useProductDetail(productId);
  const [adjustmentType, setAdjustmentType] = React.useState<'add' | 'remove'>('add');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StockAdjustmentFormData>({
    resolver: zodResolver(stockAdjustmentSchema) as any,
    defaultValues: {
      quantity: 1,
      reason: STOCK_REASONS.PURCHASE,
      notes: '',
    },
  });

  const onSubmit = async (data: StockAdjustmentFormData) => {
    try {
      const quantityChange = adjustmentType === 'add' ? data.quantity : -data.quantity;
      await productRepository.adjustStock(productId, quantityChange, data.reason, data.notes || '');
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('error'), t('adjustError'));
    }
  };

  if (isLoading || !product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <LoadingOverlay visible />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader
        title={t('adjustStock')}
        showBack
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
          {product.name} — {t('currentStock')}: {product.currentStock} {product.unit}
        </Text>

        <SegmentedButtons
          value={adjustmentType}
          onValueChange={(value) => setAdjustmentType(value as 'add' | 'remove')}
          buttons={[
            { value: 'add', label: t('addStock'), icon: 'plus' },
            { value: 'remove', label: t('removeStock'), icon: 'minus' },
          ]}
          style={styles.segmented}
        />

        <FormField
          control={control}
          name="quantity"
          label={t('quantity')}
          error={errors.quantity?.message}
          keyboardType="numeric"
        />

        <FormField
          control={control}
          name="reason"
          label={t('reason')}
          error={errors.reason?.message}
        />

        <FormField
          control={control}
          name="notes"
          label={t('notes')}
          error={errors.notes?.message}
          multiline
          numberOfLines={3}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
        >
          {t('confirmAdjustment')}
        </Button>
      </ScrollView>
      </KeyboardAvoidingView>
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
  content: {
    padding: 16,
    gap: 12,
  },
  segmented: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});
