import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Surface, Chip, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { AppHeader } from '@shared/components/AppHeader';
import { AppIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { EmptyState } from '@shared/components/EmptyState';
import { reportService } from '../services/reportService';
import { InventoryReportData, ProductStockInfo } from '@core/types';

type StockFilter = 'all' | 'lowStock' | 'outOfStock';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const InventoryReportScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('reports');
    const [report, setReport] = useState<InventoryReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<StockFilter>('all');

    useEffect(() => {
        reportService.getInventoryReport().then((data) => {
            setReport(data);
            setIsLoading(false);
        });
    }, []);

    if (isLoading || !report) {
        return <LoadingOverlay visible />;
    }

    const filteredProducts = report.products.filter((p) => {
        if (filter === 'lowStock') { return p.isLowStock; }
        if (filter === 'outOfStock') { return p.isOutOfStock; }
        return true;
    });

    const renderProduct = ({ item }: { item: ProductStockInfo }) => {
        const statusColor = item.isOutOfStock
            ? theme.colors.error
            : item.isLowStock
                ? theme.colors.tertiary
                : theme.colors.primary;
        const statusBg = item.isOutOfStock
            ? theme.colors.errorContainer
            : item.isLowStock
                ? theme.colors.tertiaryContainer
                : undefined;
        const statusLabel = item.isOutOfStock
            ? t('outOfStock')
            : item.isLowStock
                ? t('lowStock')
                : null;

        return (
            <Surface style={styles.productCard} elevation={1}>
                <View style={styles.productRow}>
                    <View style={styles.productInfo}>
                        <Text variant="titleSmall" style={[styles.productName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <View style={styles.stockRow}>
                            <View style={[styles.stockDot, { backgroundColor: statusColor }]} />
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {item.currentStock} {item.unit}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.productRight}>
                        <CurrencyText amount={item.stockValue} variant="bodyMedium" />
                        {statusLabel && statusBg && (
                            <View style={[styles.statusTag, { backgroundColor: statusBg }]}>
                                <Text variant="labelSmall" style={[styles.statusTagText, { color: statusColor }]}>
                                    {statusLabel}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Surface>
        );
    };

    const filterOptions: { key: StockFilter; label: string; count: number }[] = [
        { key: 'all', label: t('all'), count: report.products.length },
        { key: 'lowStock', label: t('lowStock'), count: report.lowStockCount },
        { key: 'outOfStock', label: t('outOfStock'), count: report.outOfStockCount },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('inventoryReport')}
                showBack
                onBack={() => navigation.goBack()}
            />

            <View style={styles.content}>
                {/* Summary Stats */}
                <View style={styles.statsRow}>
                    <Surface style={styles.statCard} elevation={1}>
                        <View style={[styles.statIconBox, { backgroundColor: theme.colors.primaryContainer }]}>
                            <AppIcon name="cash-plus" size={18} color={theme.colors.primary} />
                        </View>
                        <Text variant="labelSmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                            {t('totalStockValue')}
                        </Text>
                        <CurrencyText amount={report.totalStockValue} variant="titleMedium" />
                    </Surface>

                    <Surface style={styles.statCard} elevation={1}>
                        <View style={[styles.statIconBox, { backgroundColor: theme.colors.tertiaryContainer }]}>
                            <AppIcon name="alert-circle" size={18} color={theme.colors.tertiary} />
                        </View>
                        <Text variant="labelSmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                            {t('lowStock')}
                        </Text>
                        <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.tertiary }]}>
                            {report.lowStockCount}
                        </Text>
                    </Surface>

                    <Surface style={styles.statCard} elevation={1}>
                        <View style={[styles.statIconBox, { backgroundColor: theme.colors.errorContainer }]}>
                            <AppIcon name="x" size={18} color={theme.colors.error} />
                        </View>
                        <Text variant="labelSmall" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                            {t('outOfStock')}
                        </Text>
                        <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.error }]}>
                            {report.outOfStockCount}
                        </Text>
                    </Surface>
                </View>

                {/* Filter Chips */}
                <View style={styles.filterRow}>
                    {filterOptions.map((f) => (
                        <Chip
                            key={f.key}
                            selected={filter === f.key}
                            showSelectedCheck={false}
                            onPress={() => setFilter(f.key)}
                            compact
                            style={[
                                styles.filterChip,
                                filter === f.key && { backgroundColor: theme.colors.primaryContainer },
                            ]}
                            textStyle={[
                                styles.filterChipText,
                                filter === f.key && { color: theme.colors.primary },
                            ]}
                        >
                            {f.label} ({f.count})
                        </Chip>
                    ))}
                </View>

                <Divider />

                {/* Product List */}
                {filteredProducts.length === 0 ? (
                    <EmptyState
                        icon="package"
                        title={t('noData')}
                        subtitle={t('noDataDesc')}
                    />
                ) : (
                    <FlashList
                        data={filteredProducts}
                        renderItem={renderProduct}
                        keyExtractor={(item: ProductStockInfo) => item.id}
                        contentContainerStyle={styles.listContent}
                        // @ts-expect-error FlashList v2 moved estimatedItemSize
                        estimatedItemSize={72}
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
        paddingTop: 16,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 20,
        marginBottom: 16,
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
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    filterChip: {
        borderRadius: 20,
    },
    filterChipText: {
        fontSize: 12,
    },
    productCard: {
        borderRadius: 12,
        marginHorizontal: 20,
        overflow: 'hidden',
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    productInfo: {
        flex: 1,
        gap: 4,
        marginRight: 12,
    },
    productName: {
        fontWeight: '600',
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    stockDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    productRight: {
        alignItems: 'flex-end',
        gap: 6,
    },
    statusTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusTagText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    listContent: {
        paddingTop: 12,
        paddingBottom: 32,
    },
    listSeparator: {
        height: 8,
    },
});
