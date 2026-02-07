import React from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppHeader } from '@shared/components/AppHeader';
import { FormField } from '@shared/components/FormField';
import { customerSchema, CustomerFormData } from '../schemas/customerSchema';
import { customerRepository } from '../repositories/customerRepository';
import { useEffect } from 'react';

export const CustomerFormScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('customers');
  const customerId = route.params?.customerId;
  const isEditing = !!customerId;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isEditing) {
      customerRepository.getById(customerId).then((customer) => {
        reset({
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          notes: customer.notes,
        });
      });
    }
  }, [customerId]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (isEditing) {
        await customerRepository.update(customerId, data);
      } else {
        await customerRepository.create(data);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('error'), t('saveError'));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader
        title={isEditing ? t('editCustomer') : t('addCustomer')}
        showBack
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <FormField
          control={control}
          name="name"
          label={t('name')}
          error={errors.name?.message}
          autoFocus={!isEditing}
        />

        <FormField
          control={control}
          name="phone"
          label={t('phone')}
          error={errors.phone?.message}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <FormField
          control={control}
          name="address"
          label={t('address')}
          error={errors.address?.message}
          multiline
          numberOfLines={3}
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
    gap: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});
