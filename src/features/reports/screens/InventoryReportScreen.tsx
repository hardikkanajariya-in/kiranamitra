import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Card, Chip, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { AppHeader } from '@shared/components/AppHeader';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
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
        if (filter === 'lowStock') {
            return p.isLowStock;
        }
        if (filter === 'outOfStock') {
            return p.isOutOfStock;
        }
        return true;
    });

    const renderProduct = ({ item }: { item: ProductStockInfo }) => (
        <Card style={styles.productCard} mode="elevated">
            <Card.Content style={styles.productRow}>
                <View style={styles.productInfo}>
                    <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                        {item.name}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {item.currentStock} {item.unit}
                    </Text>
                </View>
                <View style={styles.productRight}>
                    <CurrencyText amount={item.stockValue} variant="bodyMedium" />
                    {item.isOutOfStock && (
                        <Chip compact textStyle={styles.chipText} style={[styles.statusChip, { backgroundColor: theme.colors.errorContainer }]}>
                            {t('outOfStock')}
                        </Chip>
                    )}
                    {item.isLowStock && !item.isOutOfStock && (
                        <Chip compact textStyle={styles.chipText} style={[styles.statusChip, { backgroundColor: theme.colors.tertiaryContainer }]}>
                            {t('lowStock')}
                        </Chip>
                    )}
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('inventoryReport')}
                showBack
                onBack={() => navigation.goBack()}
            />

            <View style={styles.content}>
                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <Card style={styles.summaryCard} mode="elevated">
                        <Card.Content>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('totalStockValue')}
                            </Text>
                            <CurrencyText amount={report.totalStockValue} variant="titleMedium" />
                        </Card.Content>
                    </Card>
                    <Card style={styles.summaryCard} mode="elevated">
                        <Card.Content>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('lowStock')}
                            </Text>
                            <Text variant="titleMedium" style={{ color: theme.colors.tertiary }}>
                                {report.lowStockCount}
                            </Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.summaryCard} mode="elevated">
                        <Card.Content>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('outOfStock')}
                            </Text>
                            <Text variant="titleMedium" style={{ color: theme.colors.error }}>
                                {report.outOfStockCount}
                            </Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Filter Chips */}
                <View style={styles.filterRow}>
                    {(['all', 'lowStock', 'outOfStock'] as StockFilter[]).map((f) => (
                        <Chip
                            key={f}
                            selected={filter === f}
                            onPress={() => setFilter(f)}
                            compact
                        >
                            {t(f)}
                        </Chip>
                    ))}
                </View>

                <Divider style={styles.divider} />

                {/* Product List */}
                <FlashList
                    data={filteredProducts}
                    renderItem={renderProduct}
                    keyExtractor={(item: ProductStockInfo) => item.id}
                    contentContainerStyle={styles.listContent}
                />
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
        padding: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    summaryCard: {
        flex: 1,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    divider: {
        marginBottom: 12,
    },
    productCard: {
        marginBottom: 8,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
        gap: 2,
    },
    productRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    statusChip: {
        height: 24,
    },
    chipText: {
        fontSize: 10,
    },
    listContent: {
        paddingBottom: 16,
    },
});
