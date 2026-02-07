import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppHeader } from '@shared/components/AppHeader';
import { FormField } from '@shared/components/FormField';
import { productSchema, ProductFormData } from '../schemas/productSchema';
import { productRepository } from '../repositories/productRepository';
import { UNIT_OPTIONS } from '@core/constants';

export const ProductFormScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('products');
  const productId = route.params?.productId;
  const isEditing = !!productId;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      purchasePrice: 0,
      sellingPrice: 0,
      currentStock: 0,
      lowStockThreshold: 5,
      unit: 'pcs',
      barcode: '',
    },
  });

  useEffect(() => {
    if (isEditing) {
      productRepository.getById(productId).then((product) => {
        reset({
          name: product.name,
          categoryId: product.categoryId,
          purchasePrice: product.purchasePrice,
          sellingPrice: product.sellingPrice,
          currentStock: product.currentStock,
          lowStockThreshold: product.lowStockThreshold,
          unit: product.unit,
          barcode: product.barcode,
        });
      });
    }
  }, [productId]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing) {
        await productRepository.update(productId, data);
      } else {
        await productRepository.create(data);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('error'), t('saveError'));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader
        title={isEditing ? t('editProduct') : t('addProduct')}
        showBack
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <FormField
          control={control}
          name="name"
          label={t('productName')}
          error={errors.name?.message}
          autoFocus={!isEditing}
        />

        <FormField
          control={control}
          name="purchasePrice"
          label={t('purchasePrice')}
          error={errors.purchasePrice?.message}
          keyboardType="numeric"
        />

        <FormField
          control={control}
          name="sellingPrice"
          label={t('sellingPrice')}
          error={errors.sellingPrice?.message}
          keyboardType="numeric"
        />

        <FormField
          control={control}
          name="currentStock"
          label={t('currentStock')}
          error={errors.currentStock?.message}
          keyboardType="numeric"
          disabled={isEditing}
        />

        <FormField
          control={control}
          name="lowStockThreshold"
          label={t('lowStockThreshold')}
          error={errors.lowStockThreshold?.message}
          keyboardType="numeric"
        />

        <FormField
          control={control}
          name="unit"
          label={t('unit')}
          error={errors.unit?.message}
        />

        <FormField
          control={control}
          name="barcode"
          label={t('barcode')}
          error={errors.barcode?.message}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
        >
          {isEditing ? t('update') : t('save')}
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
    gap: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});
