import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, Chip, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { AppIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { StatusBadge } from '@shared/components/StatusBadge';
import Product from '@core/database/models/Product';
import Category from '@core/database/models/Category';
import { productRepository } from '@features/products/repositories/productRepository';

interface ProductQuickAddProps {
    onAddProduct: (product: Product) => void;
    cartProductIds: string[];
}

export const ProductQuickAdd: React.FC<ProductQuickAddProps> = ({
    onAddProduct,
    cartProductIds,
}) => {
    const theme = useTheme();
    const { t } = useTranslation('billing');
    const { t: tProducts } = useTranslation('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

    useEffect(() => {
        const sub = productRepository.observeCategories().subscribe(setCategories);
        return () => sub.unsubscribe();
    }, []);

    useEffect(() => {
        const observable = selectedCategoryId
            ? productRepository.observeByCategory(selectedCategoryId)
            : productRepository.observeAll();
        const sub = observable.subscribe(setProducts);
        return () => sub.unsubscribe();
    }, [selectedCategoryId]);

    const renderProduct = ({ item }: { item: Product }) => {
        const inCart = cartProductIds.includes(item.id);
        const outOfStock = item.currentStock <= 0;

        return (
            <TouchableOpacity
                style={[
                    styles.productRow,
                    { backgroundColor: inCart ? theme.colors.secondaryContainer : theme.colors.surface },
                ]}
                onPress={() => onAddProduct(item)}
                disabled={outOfStock}
                activeOpacity={0.6}
            >
                <View style={styles.productInfo}>
                    <Text
                        variant="bodyLarge"
                        numberOfLines={1}
                        style={{ color: outOfStock ? theme.colors.onSurfaceVariant : theme.colors.onSurface }}
                    >
                        {item.name}
                    </Text>
                    <View style={styles.productMeta}>
                        <CurrencyText amount={item.sellingPrice} variant="bodySmall" />
                        {outOfStock ? (
                            <StatusBadge label={t('outOfStock')} variant="error" />
                        ) : item.isLowStock ? (
                            <Text variant="labelSmall" style={{ color: theme.colors.error }}>
                                {item.currentStock} {item.unit}
                            </Text>
                        ) : (
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {item.currentStock} {item.unit}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={styles.addSection}>
                    {inCart ? (
                        <AppIcon name="check" size={20} color={theme.colors.primary} />
                    ) : !outOfStock ? (
                        <AppIcon name="plus" size={20} color={theme.colors.primary} />
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('tapToAdd')}
                </Text>
            </View>

            {categories.length > 0 && (
                <View style={styles.chipRow}>
                    <Chip
                        selected={!selectedCategoryId}
                        onPress={() => setSelectedCategoryId(undefined)}
                        mode="outlined"
                        compact
                        style={styles.chip}
                    >
                        {tProducts('allCategories')}
                    </Chip>
                    {categories.map((cat) => (
                        <Chip
                            key={cat.id}
                            selected={selectedCategoryId === cat.id}
                            onPress={() =>
                                setSelectedCategoryId(
                                    selectedCategoryId === cat.id ? undefined : cat.id,
                                )
                            }
                            mode="outlined"
                            compact
                            style={styles.chip}
                        >
                            {cat.name}
                        </Chip>
                    ))}
                </View>
            )}

            <Divider />

            <View style={styles.listContainer}>
                <FlashList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item: Product) => item.id}
                    estimatedItemSize={60}
                    ItemSeparatorComponent={() => <Divider />}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingBottom: 8,
        gap: 6,
    },
    chip: {
        height: 32,
    },
    listContainer: {
        flex: 1,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    productInfo: {
        flex: 1,
        gap: 2,
    },
    productMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addSection: {
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
