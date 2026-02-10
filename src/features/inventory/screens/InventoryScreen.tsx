import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme, Surface, ProgressBar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { SearchInput } from '@shared/components/SearchInput';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { AppIcon } from '@shared/components/Icon';
import { useProducts } from '@features/products/hooks/useProducts';
import { formatCurrency } from '@shared/utils/currency';
import Product from '@core/database/models/Product';

type StockFilter = 'all' | 'lowStock' | 'outOfStock';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

interface RouteProp {
    params?: { filter?: string };
}

export const InventoryScreen: React.FC<{ navigation: NavigationProp; route: RouteProp }> = ({
    navigation,
    route,
}) => {
    const theme = useTheme();
    const { t } = useTranslation('inventory');
    const initialFilter = route.params?.filter as StockFilter | undefined;
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<StockFilter>(initialFilter || 'all');
    const { products, isLoading } = useProducts(searchQuery);

    const stats = useMemo(() => {
        const lowStockItems = products.filter(p => p.isLowStock);
        const outOfStockItems = products.filter(p => p.isOutOfStock);
        const totalStockValue = products.reduce(
            (sum, p) => sum + p.currentStock * p.sellingPrice, 0,
        );
        const totalCostValue = products.reduce(
            (sum, p) => sum + p.currentStock * p.purchasePrice, 0,
        );
        return {
            total: products.length,
            lowStock: lowStockItems.length,
            outOfStock: outOfStockItems.length,
            inStock: products.length - lowStockItems.length - outOfStockItems.length,
            totalStockValue,
            totalCostValue,
            potentialProfit: totalStockValue - totalCostValue,
        };
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            switch (filter) {
                case 'lowStock':
                    return product.currentStock > 0 && product.currentStock <= product.lowStockThreshold;
                case 'outOfStock':
                    return product.currentStock <= 0;
                default:
                    return true;
            }
        });
    }, [products, filter]);

    const getStockColor = (product: Product): string => {
        if (product.isOutOfStock) { return theme.colors.error; }
        if (product.isLowStock) { return theme.colors.tertiary; }
        return theme.colors.primary;
    };

    if (isLoading) {
        return <LoadingOverlay visible />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('title')}
                showBack
                onBack={() => navigation.goBack()}
            />

            {/* Stock Value Overview */}
            <Surface style={[styles.overviewCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                <View style={styles.overviewRow}>
                    <View style={styles.overviewItem}>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {t('stockValue')}
                        </Text>
                        <Text
                            variant="titleMedium"
                            style={[styles.overviewValue, { color: theme.colors.primary }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {formatCurrency(stats.totalStockValue)}
                        </Text>
                    </View>
                    <View style={[styles.overviewDivider, { backgroundColor: theme.colors.outline }]} />
                    <View style={styles.overviewItem}>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {t('costValue')}
                        </Text>
                        <Text
                            variant="titleMedium"
                            style={[styles.overviewValue, { color: theme.colors.onSurface }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {formatCurrency(stats.totalCostValue)}
                        </Text>
                    </View>
                    <View style={[styles.overviewDivider, { backgroundColor: theme.colors.outline }]} />
                    <View style={styles.overviewItem}>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {t('potentialProfit')}
                        </Text>
                        <Text
                            variant="titleMedium"
                            style={[styles.overviewValue, { color: theme.colors.primary }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {formatCurrency(stats.potentialProfit)}
                        </Text>
                    </View>
                </View>
            </Surface>

            {/* Stock Health Indicators */}
            <View style={styles.healthRow}>
                <Pressable style={styles.healthItem} onPress={() => setFilter('all')}>
                    <Surface
                        style={[
                            styles.healthCard,
                            { backgroundColor: filter === 'all' ? theme.colors.secondaryContainer : theme.colors.surface },
                        ]}
                        elevation={filter === 'all' ? 2 : 1}
                    >
                        <AppIcon name="package-variant" size={22} color={theme.colors.tertiary} />
                        <Text variant="titleLarge" style={[styles.healthNumber, { color: theme.colors.tertiary }]}>
                            {stats.total}
                        </Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {t('filterAll')}
                        </Text>
                    </Surface>
                </Pressable>

                <Pressable style={styles.healthItem} onPress={() => setFilter('lowStock')}>
                    <Surface
                        style={[
                            styles.healthCard,
                            { backgroundColor: filter === 'lowStock' ? theme.colors.tertiaryContainer : theme.colors.surface },
                        ]}
                        elevation={filter === 'lowStock' ? 2 : 1}
                    >
                        <AppIcon name="alert-circle" size={22} color={theme.colors.tertiary} />
                        <Text variant="titleLarge" style={[styles.healthNumber, { color: theme.colors.tertiary }]}>
                            {stats.lowStock}
                        </Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {t('lowStock')}
                        </Text>
                    </Surface>
                </Pressable>

                <Pressable style={styles.healthItem} onPress={() => setFilter('outOfStock')}>
                    <Surface
                        style={[
                            styles.healthCard,
                            { backgroundColor: filter === 'outOfStock' ? theme.colors.errorContainer : theme.colors.surface },
                        ]}
                        elevation={filter === 'outOfStock' ? 2 : 1}
                    >
                        <AppIcon name="close" size={22} color={theme.colors.error} />
                        <Text variant="titleLarge" style={[styles.healthNumber, { color: theme.colors.error }]}>
                            {stats.outOfStock}
                        </Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {t('outOfStock')}
                        </Text>
                    </Surface>
                </Pressable>
            </View>

            <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('searchProduct')}
            />

            {/* Result count */}
            <View style={styles.resultBar}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {filteredProducts.length} {t('itemsShowing')}
                </Text>
            </View>

            <View style={styles.listContainer}>
                {filteredProducts.length === 0 ? (
                    <EmptyState
                        icon="package-variant"
                        title={t('noInventoryItems')}
                        subtitle={t('noInventoryItemsSubtitle')}
                    />
                ) : (
                    <FlashList
                        data={filteredProducts}
                        renderItem={({ item }: { item: Product }) => {
                            const stockColor = getStockColor(item);
                            const maxDisplay = Math.max(item.lowStockThreshold * 3, item.currentStock, 1);
                            const progress = Math.min(item.currentStock / maxDisplay, 1);

                            return (
                                <Pressable
                                    onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                                >
                                    <Surface
                                        style={[styles.inventoryCard, { backgroundColor: theme.colors.surface }]}
                                        elevation={1}
                                    >
                                        {/* Stock level color strip */}
                                        <View style={[styles.stockStrip, { backgroundColor: stockColor }]} />

                                        <View style={styles.inventoryCardContent}>
                                            <View style={styles.inventoryTopRow}>
                                                <Text
                                                    variant="titleMedium"
                                                    style={{ color: theme.colors.onSurface, flex: 1 }}
                                                    numberOfLines={1}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Text
                                                    variant="titleMedium"
                                                    style={{ color: stockColor, fontWeight: '700' }}
                                                >
                                                    {item.currentStock} {item.unit}
                                                </Text>
                                            </View>

                                            <ProgressBar
                                                progress={progress}
                                                color={stockColor}
                                                style={[styles.inventoryBar, { backgroundColor: theme.colors.surfaceVariant }]}
                                            />

                                            <View style={styles.inventoryBottomRow}>
                                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                                    {t('minStock', { threshold: item.lowStockThreshold, unit: item.unit })}
                                                </Text>
                                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                                    {t('valueLabel')}: {formatCurrency(item.currentStock * item.sellingPrice)}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Navigate arrow */}
                                        <View style={styles.navArrow}>
                                            <AppIcon name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
                                        </View>
                                    </Surface>
                                </Pressable>
                            );
                        }}
                        keyExtractor={(item: Product) => item.id}
                        estimatedItemSize={90}
                        contentContainerStyle={styles.listContent}
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
    overviewCard: {
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 12,
        padding: 16,
    },
    overviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    overviewItem: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
        paddingHorizontal: 4,
    },
    overviewValue: {
        fontWeight: '700',
    },
    overviewDivider: {
        width: 1,
        height: 36,
        opacity: 0.3,
    },
    healthRow: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 4,
        gap: 8,
    },
    healthItem: {
        flex: 1,
    },
    healthCard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 2,
    },
    healthNumber: {
        fontWeight: '700',
    },
    resultBar: {
        paddingHorizontal: 20,
        paddingVertical: 4,
    },
    listContainer: {
        flex: 1,
    },
    inventoryCard: {
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    stockStrip: {
        width: 4,
    },
    inventoryCardContent: {
        flex: 1,
        padding: 12,
        gap: 6,
    },
    inventoryTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inventoryBar: {
        height: 6,
        borderRadius: 3,
    },
    inventoryBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navArrow: {
        justifyContent: 'center',
        paddingRight: 8,
    },
    listContent: {
        paddingBottom: 16,
        paddingTop: 4,
    },
});
