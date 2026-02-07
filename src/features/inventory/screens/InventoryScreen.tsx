import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { SearchInput } from '@shared/components/SearchInput';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { ProductCard } from '@features/products/components/ProductCard';
import { useProducts } from '@features/products/hooks/useProducts';
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

    const filteredProducts = products.filter((product) => {
        switch (filter) {
            case 'lowStock':
                return product.currentStock > 0 && product.currentStock <= product.lowStockThreshold;
            case 'outOfStock':
                return product.currentStock <= 0;
            default:
                return true;
        }
    });

    if (isLoading) {
        return <LoadingOverlay visible />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader title={t('title')} />

            <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('searchPlaceholder')}
            />

            <View style={styles.filterRow}>
                <Chip
                    selected={filter === 'all'}
                    onPress={() => setFilter('all')}
                    mode="outlined"
                    style={styles.chip}
                >
                    {t('filterAll')} ({products.length})
                </Chip>
                <Chip
                    selected={filter === 'lowStock'}
                    onPress={() => setFilter('lowStock')}
                    mode="outlined"
                    style={styles.chip}
                >
                    {t('lowStock')} ({products.filter((p) => p.currentStock > 0 && p.currentStock <= p.lowStockThreshold).length})
                </Chip>
                <Chip
                    selected={filter === 'outOfStock'}
                    onPress={() => setFilter('outOfStock')}
                    mode="outlined"
                    style={styles.chip}
                >
                    {t('outOfStock')} ({products.filter((p) => p.currentStock <= 0).length})
                </Chip>
            </View>

            {filteredProducts.length === 0 ? (
                <EmptyState
                    icon="package-variant"
                    title={t('noInventoryItems')}
                    subtitle={t('noInventoryItemsSubtitle')}
                />
            ) : (
                <FlashList
                    data={filteredProducts}
                    renderItem={({ item }: { item: Product }) => (
                        <ProductCard
                            name={item.name}
                            sellingPrice={item.sellingPrice}
                            currentStock={item.currentStock}
                            unit={item.unit}
                            isLowStock={item.isLowStock}
                            isOutOfStock={item.isOutOfStock}
                            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                        />
                    )}
                    keyExtractor={(item: Product) => item.id}
                    estimatedItemSize={72}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
    },
    chip: {
        flex: 0,
    },
    listContent: {
        paddingBottom: 16,
    },
});
