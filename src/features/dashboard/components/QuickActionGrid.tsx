import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@shared/components/Icon';

interface QuickActionItem {
    icon: string;
    labelKey: string;
    onPress: () => void;
    bgColor: string;
    iconColor: string;
}

interface QuickActionGridProps {
    onNewBill: () => void;
    onAddCustomer: () => void;
    onAddProduct: () => void;
    onCollectPayment: () => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
    onNewBill,
    onAddCustomer,
    onAddProduct,
    onCollectPayment,
}) => {
    const theme = useTheme();
    const { t } = useTranslation('dashboard');

    const actions: QuickActionItem[] = [
        {
            icon: 'receipt',
            labelKey: 'newBill',
            onPress: onNewBill,
            bgColor: theme.colors.primaryContainer,
            iconColor: theme.colors.onPrimaryContainer,
        },
        {
            icon: 'account-plus',
            labelKey: 'addCustomer',
            onPress: onAddCustomer,
            bgColor: theme.colors.secondaryContainer,
            iconColor: theme.colors.onSecondaryContainer,
        },
        {
            icon: 'package-variant',
            labelKey: 'addProduct',
            onPress: onAddProduct,
            bgColor: theme.colors.tertiaryContainer,
            iconColor: theme.colors.onTertiaryContainer,
        },
        {
            icon: 'cash-plus',
            labelKey: 'collectPayment',
            onPress: onCollectPayment,
            bgColor: theme.colors.inversePrimary,
            iconColor: theme.colors.onPrimaryContainer,
        },
    ];

    return (
        <View style={styles.container}>
            <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                {t('quickActions')}
            </Text>
            <View style={styles.grid}>
                {actions.map((action) => (
                    <TouchableOpacity
                        key={action.labelKey}
                        style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
                        onPress={action.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: action.bgColor }]}>
                            <AppIcon name={action.icon} size={22} color={action.iconColor} />
                        </View>
                        <Text
                            variant="labelMedium"
                            style={[styles.actionLabel, { color: theme.colors.onSurface }]}
                            numberOfLines={2}
                        >
                            {t(action.labelKey)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        marginBottom: 12,
        fontWeight: '600',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        fontSize: 12,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    actionCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderRadius: 12,
        elevation: 1,
        shadowColor: undefined,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionLabel: {
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 16,
    },
});
