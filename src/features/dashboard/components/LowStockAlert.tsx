import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@shared/components/Icon';
import { useTranslation } from 'react-i18next';
import { Colors } from '@core/theme/colors';

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
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.row}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.warningBg }]}>
                    <AppIcon name="alert-circle" size={22} color={Colors.warning} />
                </View>

                <View style={styles.content}>
                    <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                        {t('stockAlerts')}
                    </Text>
                    <View style={styles.badges}>
                        {outOfStockCount > 0 && (
                            <View style={[styles.badge, { backgroundColor: Colors.errorBg }]}>
                                <View style={[styles.dot, { backgroundColor: Colors.stockOut }]} />
                                <Text variant="labelSmall" style={{ color: Colors.error }}>
                                    {t('outOfStock', { count: outOfStockCount })}
                                </Text>
                            </View>
                        )}
                        {lowStockCount > 0 && (
                            <View style={[styles.badge, { backgroundColor: Colors.warningBg }]}>
                                <View style={[styles.dot, { backgroundColor: Colors.stockLow }]} />
                                <Text variant="labelSmall" style={{ color: Colors.warningDark }}>
                                    {t('lowStock', { count: lowStockCount })}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={[styles.alertCount, { backgroundColor: Colors.errorBg }]}>
                    <Text variant="titleSmall" style={{ color: Colors.error, fontWeight: '700' }}>
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
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
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
