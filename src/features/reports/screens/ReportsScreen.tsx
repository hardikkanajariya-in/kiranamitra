import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Surface, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { AppIcon } from '@shared/components/Icon';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

const REPORT_ICON_MAP: Record<string, { icon: string; bg: string; fg: string }> = {
    sales: { icon: 'chart-line', bg: 'primaryContainer', fg: 'primary' },
    credit: { icon: 'account-cash', bg: 'errorContainer', fg: 'error' },
    inventory: { icon: 'package-variant', bg: 'tertiaryContainer', fg: 'tertiary' },
    performance: { icon: 'chart-bar', bg: 'secondaryContainer', fg: 'secondary' },
};

export const ReportsScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('reports');

    const reports = [
        {
            key: 'sales',
            title: t('salesReport'),
            description: t('salesReportDesc'),
            screen: 'SalesReport',
        },
        {
            key: 'credit',
            title: t('creditReport'),
            description: t('creditReportDesc'),
            screen: 'CreditReport',
        },
        {
            key: 'inventory',
            title: t('inventoryReport'),
            description: t('inventoryReportDesc'),
            screen: 'InventoryReport',
        },
        {
            key: 'performance',
            title: t('productPerformance'),
            description: t('productPerformanceDesc'),
            screen: 'ProductPerformance',
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader title={t('title')} />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text variant="titleSmall" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
                    {t('title')}
                </Text>

                {reports.map((report, index) => {
                    const iconConfig = REPORT_ICON_MAP[report.key];
                    const bgColor = (theme.colors as unknown as Record<string, string>)[iconConfig.bg] ?? theme.colors.primaryContainer;
                    const fgColor = (theme.colors as unknown as Record<string, string>)[iconConfig.fg] ?? theme.colors.primary;

                    return (
                        <Surface
                            key={report.screen}
                            style={[
                                styles.card,
                                index === reports.length - 1 && styles.cardLast,
                            ]}
                            elevation={1}
                        >
                            <TouchableRipple
                                onPress={() => navigation.navigate(report.screen)}
                                borderless
                                style={styles.cardRipple}
                            >
                                <View style={styles.cardInner}>
                                    <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
                                        <AppIcon name={iconConfig.icon} size={24} color={fgColor} />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                                            {report.title}
                                        </Text>
                                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={2}>
                                            {report.description}
                                        </Text>
                                    </View>
                                    <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
                                </View>
                            </TouchableRipple>
                        </Surface>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 32,
    },
    sectionLabel: {
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        fontSize: 12,
        marginBottom: 12,
    },
    card: {
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    cardLast: {
        marginBottom: 0,
    },
    cardRipple: {
        borderRadius: 12,
    },
    cardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
        marginRight: 8,
        gap: 2,
    },
    cardTitle: {
        fontWeight: '600',
    },
});
