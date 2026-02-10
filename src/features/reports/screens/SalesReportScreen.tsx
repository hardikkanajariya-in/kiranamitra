import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { DateRangePicker } from '@shared/components/DateRangePicker';
import { reportService } from '../services/reportService';
import { SalesReportData, DateRange } from '@core/types';
import { getDateRangeForPeriod } from '@shared/utils/date';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const SalesReportScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('reports');
    const [dateRange, setDateRange] = useState<DateRange>(getDateRangeForPeriod('thisMonth'));
    const [report, setReport] = useState<SalesReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        reportService.getSalesReport(dateRange.from, dateRange.to).then((data) => {
            setReport(data);
            setIsLoading(false);
        });
    }, [dateRange]);

    if (isLoading || !report) {
        return <LoadingOverlay visible />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('salesReport')}
                showBack
                onBack={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <DateRangePicker
                    from={dateRange.from}
                    to={dateRange.to}
                    onChange={(range) => setDateRange(range)}
                />

                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <Card style={styles.summaryCard} mode="elevated">
                        <Card.Content>
                            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('totalSales')}
                            </Text>
                            <CurrencyText amount={report.totalSales} variant="headlineSmall" />
                        </Card.Content>
                    </Card>

                    <Card style={styles.summaryCard} mode="elevated">
                        <Card.Content>
                            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('totalBills')}
                            </Text>
                            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                                {report.totalBills}
                            </Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.summaryCard} mode="elevated">
                        <Card.Content>
                            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('averageBill')}
                            </Text>
                            <CurrencyText amount={report.averageBill} variant="headlineSmall" />
                        </Card.Content>
                    </Card>
                </View>

                {/* Daily Breakdown */}
                <Card style={styles.detailCard} mode="elevated">
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            {t('dailyBreakdown')}
                        </Text>
                        {report.dailyBreakdown.map((day) => (
                            <View key={day.date} style={[styles.dailyRow, { borderBottomColor: theme.colors.outlineVariant }]}>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                    {day.date}
                                </Text>
                                <View style={styles.dailyRight}>
                                    <CurrencyText amount={day.total} variant="bodyMedium" />
                                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                        {day.billCount} {t('bills')}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </Card.Content>
                </Card>
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
        gap: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 8,
    },
    summaryCard: {
        flex: 1,
    },
    detailCard: {},
    sectionTitle: {
        fontWeight: '700',
        marginBottom: 12,
    },
    dailyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
    },
    dailyRight: {
        alignItems: 'flex-end',
        gap: 2,
    },
});
