import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { SearchInput } from '@shared/components/SearchInput';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { useProducts, useCategories } from '../hooks/useProducts';
import Product from '@core/database/models/Product';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const ProductListScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('products');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
    const { products, isLoading } = useProducts(searchQuery, selectedCategoryId);
    const { categories } = useCategories();

    if (isLoading) {
        return <LoadingOverlay visible />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('title')}
                actions={[
                    { icon: 'plus', onPress: () => navigation.navigate('ProductForm') },
                ]}
            />

            <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('searchProduct')}
            />

            <CategoryFilter
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
            />

            {products.length === 0 ? (
                <EmptyState
                    icon="package-variant"
                    title={t('noProducts')}
                    subtitle={t('noProductsSubtitle')}
                    actionLabel={t('addProduct')}
                    onAction={() => navigation.navigate('ProductForm')}
                />
            ) : (
                <View style={styles.listContainer}>
                    <FlashList
                        data={products}
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
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 16,
    },
});
