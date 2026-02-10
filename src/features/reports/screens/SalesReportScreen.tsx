import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Surface, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { AppIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { EmptyState } from '@shared/components/EmptyState';
import { DateRangePicker } from '@shared/components/DateRangePicker';
import { reportService } from '../services/reportService';
import { SalesReportData, DateRange } from '@core/types';
import { getDateRangeForPeriod } from '@shared/utils/date';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

interface StatCardProps {
    icon: string;
    label: string;
    children: React.ReactNode;
    iconBg: string;
    iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, children, iconBg, iconColor }) => {
    const theme = useTheme();
    return (
        <Surface style={statStyles.card} elevation={1}>
            <View style={[statStyles.iconBox, { backgroundColor: iconBg }]}>
                <AppIcon name={icon} size={18} color={iconColor} />
            </View>
            <Text variant="labelSmall" style={[statStyles.label, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                {label}
            </Text>
            <View style={statStyles.value}>
                {children}
            </View>
        </Surface>
    );
};

const statStyles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'flex-start',
        gap: 8,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        fontSize: 11,
    },
    value: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
});

export const SalesReportScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('reports');
    const [dateRange, setDateRange] = useState<DateRange>(getDateRangeForPeriod('thisMonth'));
    const [report, setReport] = useState<SalesReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadReport = useCallback(async () => {
        setIsLoading(true);
        const data = await reportService.getSalesReport(dateRange.from, dateRange.to);
        setReport(data);
        setIsLoading(false);
    }, [dateRange]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    if (isLoading || !report) {
        return <LoadingOverlay visible />;
    }

    const hasData = report.dailyBreakdown.length > 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('salesReport')}
                showBack
                onBack={() => navigation.goBack()}
            />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Date Range Picker */}
                <DateRangePicker
                    from={dateRange.from}
                    to={dateRange.to}
                    onChange={(range) => setDateRange(range)}
                />

                {/* Summary Stats */}
                <View style={styles.statsRow}>
                    <StatCard
                        icon="cash-plus"
                        label={t('totalSales')}
                        iconBg={theme.colors.primaryContainer}
                        iconColor={theme.colors.primary}
                    >
                        <CurrencyText amount={report.totalSales} variant="titleLarge" />
                    </StatCard>
                    <StatCard
                        icon="receipt"
                        label={t('totalBills')}
                        iconBg={theme.colors.tertiaryContainer}
                        iconColor={theme.colors.tertiary}
                    >
                        <Text variant="titleLarge" style={[styles.statValue, { color: theme.colors.onSurface }]}>
                            {report.totalBills}
                        </Text>
                    </StatCard>
                </View>

                <View style={styles.statsRow}>
                    <StatCard
                        icon="chart-line"
                        label={t('averageBill')}
                        iconBg={theme.colors.secondaryContainer}
                        iconColor={theme.colors.secondary}
                    >
                        <CurrencyText amount={report.averageBill} variant="titleLarge" />
                    </StatCard>
                </View>

                {/* Daily Breakdown */}
                <View style={styles.sectionHeader}>
                    <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                        {t('dailyBreakdown')}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {report.dailyBreakdown.length} {t('days', { defaultValue: 'days' })}
                    </Text>
                </View>

                {!hasData ? (
                    <EmptyState
                        icon="chart-bar"
                        title={t('noData')}
                        subtitle={t('noReportData')}
                    />
                ) : (
                    <Surface style={styles.tableCard} elevation={1}>
                        {/* Table Header */}
                        <View style={[styles.tableHeaderRow, { borderBottomColor: theme.colors.outlineVariant }]}>
                            <Text variant="labelSmall" style={[styles.tableHeaderCell, styles.dateCol, { color: theme.colors.onSurfaceVariant }]}>
                                {t('from', { defaultValue: 'Date' })}
                            </Text>
                            <Text variant="labelSmall" style={[styles.tableHeaderCell, styles.billsCol, { color: theme.colors.onSurfaceVariant }]}>
                                {t('bills')}
                            </Text>
                            <Text variant="labelSmall" style={[styles.tableHeaderCell, styles.amountCol, { color: theme.colors.onSurfaceVariant }]}>
                                {t('totalSales', { defaultValue: 'Amount' })}
                            </Text>
                        </View>

                        {/* Table Rows */}
                        {report.dailyBreakdown.map((day, index) => (
                            <View key={day.date}>
                                <View style={styles.tableRow}>
                                    <Text variant="bodyMedium" style={[styles.dateCol, { color: theme.colors.onSurface }]}>
                                        {day.date}
                                    </Text>
                                    <View style={styles.billsCol}>
                                        <View style={[styles.billCountBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
                                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                                {day.billCount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.amountCol}>
                                        <CurrencyText amount={day.total} variant="bodyMedium" />
                                    </View>
                                </View>
                                {index < report.dailyBreakdown.length - 1 && (
                                    <Divider style={{ marginHorizontal: 16 }} />
                                )}
                            </View>
                        ))}
                    </Surface>
                )}
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
        paddingTop: 12,
        paddingBottom: 32,
        gap: 16,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statValue: {
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    sectionTitle: {
        fontWeight: '700',
    },
    tableCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    tableHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    tableHeaderCell: {
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontSize: 11,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dateCol: {
        flex: 2,
    },
    billsCol: {
        flex: 1,
        alignItems: 'center',
    },
    amountCol: {
        flex: 1.5,
        alignItems: 'flex-end',
    },
    billCountBadge: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
    },
});
