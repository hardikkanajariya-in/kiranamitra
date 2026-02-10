import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
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
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.row}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.tertiaryContainer }]}>
                    <AppIcon name="alert-circle" size={22} color={theme.colors.onTertiaryContainer} />
                </View>

                <View style={styles.content}>
                    <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                        {t('stockAlerts')}
                    </Text>
                    <View style={styles.badges}>
                        {outOfStockCount > 0 && (
                            <View style={[styles.badge, { backgroundColor: theme.colors.errorContainer }]}>
                                <View style={[styles.dot, { backgroundColor: theme.colors.error }]} />
                                <Text variant="labelSmall" style={{ color: theme.colors.onErrorContainer }}>
                                    {t('outOfStock', { count: outOfStockCount })}
                                </Text>
                            </View>
                        )}
                        {lowStockCount > 0 && (
                            <View style={[styles.badge, { backgroundColor: theme.colors.tertiaryContainer }]}>
                                <View style={[styles.dot, { backgroundColor: theme.colors.tertiary }]} />
                                <Text variant="labelSmall" style={{ color: theme.colors.onTertiaryContainer }}>
                                    {t('lowStock', { count: lowStockCount })}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={[styles.alertCount, { backgroundColor: theme.colors.errorContainer }]}>
                    <Text variant="titleSmall" style={{ color: theme.colors.onErrorContainer, fontWeight: '700' }}>
                        {totalAlerts}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        elevation: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontWeight: '600',
        marginBottom: 6,
    },
    badges: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        gap: 5,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    alertCount: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
