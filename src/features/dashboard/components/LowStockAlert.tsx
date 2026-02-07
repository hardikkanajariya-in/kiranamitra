import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, Badge } from 'react-native-paper';
import { AppIcon } from '@shared/components/Icon';
import { useTranslation } from 'react-i18next';

interface LowStockAlertProps {
    lowStockCount: number;
    outOfStockCount: number;
    onPress?: () => void;
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({
    lowStockCount,
    outOfStockCount,
    onPress,
}) => {
    const theme = useTheme();
    const { t } = useTranslation('dashboard');

    const totalAlerts = lowStockCount + outOfStockCount;

    if (totalAlerts === 0) {
        return null;
    }

    return (
        <Card
            style={[styles.card, { borderLeftWidth: 4, borderLeftColor: theme.colors.error }]}
            mode="elevated"
            onPress={onPress}
        >
            <Card.Content>
                <View style={styles.row}>
                    <View style={styles.iconContainer}>
                        <AppIcon name="alert-circle" size={24} color={theme.colors.error} />
                        <Badge style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                            {totalAlerts}
                        </Badge>
                    </View>

                    <View style={styles.textContainer}>
                        <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                            {t('stockAlerts')}
                        </Text>
                        <View style={styles.details}>
                            {outOfStockCount > 0 && (
                                <Text variant="bodySmall" style={{ color: theme.colors.error }}>
                                    {t('outOfStock', { count: outOfStockCount })}
                                </Text>
                            )}
                            {lowStockCount > 0 && (
                                <Text variant="bodySmall" style={{ color: theme.colors.tertiary }}>
                                    {t('lowStock', { count: lowStockCount })}
                                </Text>
                            )}
                        </View>
                    </View>

                    <AppIcon name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        position: 'relative',
        marginRight: 12,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
    },
    textContainer: {
        flex: 1,
    },
    details: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
});
