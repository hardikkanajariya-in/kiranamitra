import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Surface, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { AppHeader } from '@shared/components/AppHeader';
import { AppIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { DateRangePicker } from '@shared/components/DateRangePicker';
import { EmptyState } from '@shared/components/EmptyState';
import { reportService } from '../services/reportService';
import { ProductPerformanceData, DateRange } from '@core/types';
import { getDateRangeForPeriod } from '@shared/utils/date';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'] as const;

export const ProductPerformanceScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('reports');
    const [dateRange, setDateRange] = useState<DateRange>(getDateRangeForPeriod('thisMonth'));
    const [data, setData] = useState<ProductPerformanceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        const result = await reportService.getProductPerformance(dateRange.from, dateRange.to);
        setData(result);
        setIsLoading(false);
    }, [dateRange]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (isLoading) {
        return <LoadingOverlay visible />;
    }

    const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);
    const totalQty = data.reduce((sum, p) => sum + p.quantitySold, 0);
    const maxRevenue = data.length > 0 ? data[0].revenue : 1;

    const renderProduct = ({ item, index }: { item: ProductPerformanceData; index: number }) => {
        const isTopThree = index < 3;
        const barWidth = maxRevenue > 0 ? Math.max((item.revenue / maxRevenue) * 100, 8) : 8;

        return (
            <Surface style={styles.productCard} elevation={1}>
                <View style={styles.productRow}>
                    {/* Rank indicator */}
                    <View style={[
                        styles.rankContainer,
                        {
                            backgroundColor: isTopThree
                                ? `${MEDAL_COLORS[index]}20`
                                : theme.colors.surfaceVariant,
                        },
                    ]}>
                        <Text
                            variant="labelLarge"
                            style={[
                                styles.rankText,
                                {
                                    color: isTopThree
                                        ? MEDAL_COLORS[index]
                                        : theme.colors.onSurfaceVariant,
                                },
                            ]}
                        >
                            {index + 1}
                        </Text>
                    </View>

                    {/* Product info */}
                    <View style={styles.productInfo}>
                        <Text variant="titleSmall" style={[styles.productName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                            {item.name}
                        </Text>

                        {/* Revenue progress bar */}
                        <View style={styles.barContainer}>
                            <View style={[styles.barTrack, { backgroundColor: theme.colors.surfaceVariant }]}>
                                <View
                                    style={[
                                        styles.barFill,
                                        {
                                            width: `${barWidth}%`,
                                            backgroundColor: isTopThree
                                                ? theme.colors.primary
                                                : theme.colors.outline,
                                        },
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.productMeta}>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('qtySold')}: {item.quantitySold}
                            </Text>
                        </View>
                    </View>

                    {/* Revenue */}
                    <View style={styles.revenueContainer}>
                        <CurrencyText amount={item.revenue} variant="titleSmall" />
                    </View>
                </View>
            </Surface>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('productPerformance')}
                showBack
                onBack={() => navigation.goBack()}
            />

            <View style={styles.content}>
                {/* Date Picker */}
                <View style={styles.datePickerWrap}>
                    <DateRangePicker
                        from={dateRange.from}
                        to={dateRange.to}
                        onChange={(range) => setDateRange(range)}
                    />
                </View>

                {/* Summary Stats */}
                <View style={styles.statsRow}>
                    <Surface style={styles.statCard} elevation={1}>
                        <View style={[styles.statIconBox, { backgroundColor: theme.colors.primaryContainer }]}>
                            <AppIcon name="cash-plus" size={18} color={theme.colors.primary} />
                        </View>
                        <Text variant="labelSmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                            {t('totalRevenue')}
                        </Text>
                        <CurrencyText amount={totalRevenue} variant="titleMedium" />
                    </Surface>

                    <Surface style={styles.statCard} elevation={1}>
                        <View style={[styles.statIconBox, { backgroundColor: theme.colors.tertiaryContainer }]}>
                            <AppIcon name="package-variant" size={18} color={theme.colors.tertiary} />
                        </View>
                        <Text variant="labelSmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                            {t('totalProducts')}
                        </Text>
                        <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.onSurface }]}>
                            {data.length}
                        </Text>
                    </Surface>

                    <Surface style={styles.statCard} elevation={1}>
                        <View style={[styles.statIconBox, { backgroundColor: theme.colors.secondaryContainer }]}>
                            <AppIcon name="cart-outline" size={18} color={theme.colors.secondary} />
                        </View>
                        <Text variant="labelSmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                            {t('totalQtySold')}
                        </Text>
                        <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.onSurface }]}>
                            {totalQty}
                        </Text>
                    </Surface>
                </View>

                <Divider style={styles.divider} />

                {data.length === 0 ? (
                    <EmptyState
                        icon="chart-bar"
                        title={t('noData')}
                        subtitle={t('noDataDesc')}
                    />
                ) : (
                    <FlashList
                        data={data}
                        renderItem={renderProduct}
                        keyExtractor={(item: ProductPerformanceData) => item.id}
                        contentContainerStyle={styles.listContent}
                        // @ts-expect-error FlashList v2 moved estimatedItemSize
                        estimatedItemSize={88}
                        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingTop: 12,
    },
    datePickerWrap: {
        paddingHorizontal: 20,
        marginBottom: 4,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 20,
        marginTop: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: 'flex-start',
        gap: 6,
    },
    statIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statLabel: {
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        fontSize: 10,
    },
    statValue: {
        fontWeight: '700',
    },
    divider: {
        marginVertical: 16,
        marginHorizontal: 20,
    },
    productCard: {
        borderRadius: 12,
        marginHorizontal: 20,
        overflow: 'hidden',
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 14,
    },
    rankContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankText: {
        fontWeight: '800',
        fontSize: 14,
    },
    productInfo: {
        flex: 1,
        gap: 4,
    },
    productName: {
        fontWeight: '600',
    },
    barContainer: {
        marginTop: 2,
    },
    barTrack: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 2,
    },
    productMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    revenueContainer: {
        alignItems: 'flex-end',
    },
    listContent: {
        paddingBottom: 32,
    },
    listSeparator: {
        height: 8,
    },
});
