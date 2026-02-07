import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const ReportsScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('reports');

    const reports = [
        {
            icon: 'chart-line',
            title: t('salesReport'),
            description: t('salesReportDesc'),
            screen: 'SalesReport',
        },
        {
            icon: 'account-cash',
            title: t('creditReport'),
            description: t('creditReportDesc'),
            screen: 'CreditReport',
        },
        {
            icon: 'package-variant',
            title: t('inventoryReport'),
            description: t('inventoryReportDesc'),
            screen: 'InventoryReport',
        },
        {
            icon: 'chart-bar',
            title: t('productPerformance'),
            description: t('productPerformanceDesc'),
            screen: 'ProductPerformance',
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader title={t('title')} />

            <ScrollView contentContainerStyle={styles.content}>
                {reports.map((report) => (
                    <Card
                        key={report.screen}
                        style={styles.card}
                        mode="elevated"
                        onPress={() => navigation.navigate(report.screen)}
                    >
                        <Card.Content style={styles.cardContent}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                                <Icon name={report.icon} size={28} color={theme.colors.primary} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                                    {report.title}
                                </Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {report.description}
                                </Text>
                            </View>
                            <Icon name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 12,
    },
    card: {},
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
});
