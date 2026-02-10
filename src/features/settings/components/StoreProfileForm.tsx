import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, TextInput, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSettingsStore } from '../store/useSettingsStore';
import { StoreProfile } from '@core/types';

const storeProfileSchema = z.object({
    name: z.string().min(1, 'Store name is required'),
    address: z.string().optional().default(''),
    phone: z.string().optional().default(''),
    gstNumber: z.string().optional().default(''),
});

type StoreProfileFormData = z.infer<typeof storeProfileSchema>;

export const StoreProfileForm: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation('settings');
    const { storeProfile, setStoreProfile } = useSettingsStore();

    const { control, handleSubmit, formState: { errors, isDirty } } = useForm({
        resolver: zodResolver(storeProfileSchema),
        defaultValues: {
            name: storeProfile.name,
            address: storeProfile.address,
            phone: storeProfile.phone,
            gstNumber: storeProfile.gstNumber,
        },
    });

    const onSubmit = (data: StoreProfileFormData) => {
        setStoreProfile(data as StoreProfile);
    };

    return (
        <View style={styles.container}>
            <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                {t('storeProfile')}
            </Text>

            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        mode="outlined"
                        label={t('storeName')}
                        value={value}
                        onChangeText={onChange}
                        error={!!errors.name}
                        style={styles.input}
                    />
                )}
            />

            <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        mode="outlined"
                        label={t('storeAddress')}
                        value={value}
                        onChangeText={onChange}
                        multiline
                        numberOfLines={2}
                        style={styles.input}
                    />
                )}
            />

            <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        mode="outlined"
                        label={t('storePhone')}
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                )}
            />

            <Controller
                control={control}
                name="gstNumber"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        mode="outlined"
                        label={t('gstNumber')}
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="characters"
                        style={styles.input}
                    />
                )}
            />

            <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                disabled={!isDirty}
                style={styles.saveButton}
            >
                {t('save')}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontWeight: '700',
        marginBottom: 12,
    },
    input: {
        marginBottom: 12,
    },
    saveButton: {
        marginTop: 4,
    },
});
