import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, FlatList } from 'react-native';
import { Text, useTheme, Button, Divider, Badge } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppIcon, paperIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import Product from '@core/database/models/Product';
import { productRepository } from '@features/products/repositories/productRepository';
import { billRepository } from '../repositories/billRepository';

interface SelectedItem {
    product: Product;
    quantity: number;
}

interface PopularProductsListProps {
    onAddProducts: (items: SelectedItem[]) => void;
    cartProductIds: string[];
}

const POPULAR_LIMIT = 20;

export const PopularProductsList: React.FC<PopularProductsListProps> = ({
    onAddProducts,
    cartProductIds,
}) => {
    const theme = useTheme();
    const { t } = useTranslation('billing');
    const [popularProducts, setPopularProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const loadPopularProducts = async () => {
            try {
                // Get popular product IDs from bill history
                const popularIds = await billRepository.getPopularProductIds(POPULAR_LIMIT);

                // Fetch active products
                const allProducts = await productRepository.observeAll()
                    .subscribe(() => { })
                    .unsubscribe;

                // Use a one-time fetch instead
                const allActiveProducts = await new Promise<Product[]>((resolve) => {
                    const sub = productRepository.observeAll().subscribe((products) => {
                        resolve(products);
                        setTimeout(() => sub.unsubscribe(), 0);
                    });
                });

                if (cancelled) return;

                let result: Product[];

                if (popularIds.length > 0) {
                    // Build ordered list from popular IDs
                    const productMap = new Map<string, Product>();
                    for (const p of allActiveProducts) {
                        productMap.set(p.id, p);
                    }

                    // Ordered by popularity
                    const popular: Product[] = [];
                    for (const id of popularIds) {
                        const product = productMap.get(id);
                        if (product && product.isActive) {
                            popular.push(product);
                        }
                    }

                    // If we have fewer than POPULAR_LIMIT popular products,
                    // fill remaining slots with other active products
                    if (popular.length < POPULAR_LIMIT) {
                        const popularSet = new Set(popularIds);
                        const remaining = allActiveProducts
                            .filter((p) => !popularSet.has(p.id))
                            .slice(0, POPULAR_LIMIT - popular.length);
                        popular.push(...remaining);
                    }

                    result = popular.slice(0, POPULAR_LIMIT);
                } else {
                    // No sales history — show newest products first
                    result = allActiveProducts.slice(0, POPULAR_LIMIT);
                }

                if (!cancelled) {
                    setPopularProducts(result);
                    setIsLoading(false);
                }
            } catch {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadPopularProducts();
        return () => { cancelled = true; };
    }, []);

    const toggleProduct = useCallback((product: Product) => {
        setSelectedItems((prev) => {
            const next = new Map(prev);
            if (next.has(product.id)) {
                next.delete(product.id);
            } else {
                next.set(product.id, { product, quantity: 1 });
            }
            return next;
        });
    }, []);

    const updateQuantity = useCallback((productId: string, delta: number) => {
        setSelectedItems((prev) => {
            const next = new Map(prev);
            const item = next.get(productId);
            if (!item) return prev;

            const newQty = item.quantity + delta;
            if (newQty <= 0) {
                next.delete(productId);
            } else if (newQty <= item.product.currentStock) {
                next.set(productId, { ...item, quantity: newQty });
            }
            return next;
        });
    }, []);

    const handleAddAll = useCallback(() => {
        const items = [...selectedItems.values()];
        if (items.length > 0) {
            onAddProducts(items);
            setSelectedItems(new Map());
        }
    }, [selectedItems, onAddProducts]);

    const totalSelectedCount = [...selectedItems.values()].reduce(
        (sum, item) => sum + item.quantity, 0,
    );

    const renderProduct = useCallback(({ item }: { item: Product }) => {
        const inCart = cartProductIds.includes(item.id);
        const outOfStock = item.currentStock <= 0;
        const selected = selectedItems.get(item.id);
        const isSelected = !!selected;

        return (
            <TouchableOpacity
                style={[
                    styles.productRow,
                    {
                        backgroundColor: isSelected
                            ? theme.colors.primaryContainer
                            : inCart
                                ? theme.colors.secondaryContainer
                                : theme.colors.surface,
                    },
                ]}
                onPress={() => !outOfStock && !inCart && toggleProduct(item)}
                disabled={outOfStock || inCart}
                activeOpacity={0.6}
            >
                <View style={styles.productInfo}>
                    <Text
                        variant="bodyLarge"
                        numberOfLines={1}
                        style={{
                            color: outOfStock
                                ? theme.colors.onSurfaceVariant
                                : theme.colors.onSurface,
                        }}
                    >
                        {item.name}
                    </Text>
                    <View style={styles.productMeta}>
                        <CurrencyText amount={item.sellingPrice} variant="bodySmall" />
                        {outOfStock ? (
                            <Text variant="labelSmall" style={{ color: theme.colors.error }}>
                                {t('outOfStock')}
                            </Text>
                        ) : (
                            <Text
                                variant="labelSmall"
                                style={{
                                    color: item.isLowStock
                                        ? theme.colors.error
                                        : theme.colors.onSurfaceVariant,
                                }}
                            >
                                {item.currentStock} {item.unit}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.actionSection}>
                    {inCart ? (
                        <AppIcon name="check" size={18} color={theme.colors.primary} />
                    ) : outOfStock ? null : isSelected ? (
                        <View style={styles.qtyControl}>
                            <Pressable
                                onPress={() => updateQuantity(item.id, -1)}
                                hitSlop={8}
                                style={[styles.qtyButton, { backgroundColor: theme.colors.surfaceVariant }]}
                            >
                                <AppIcon name="minus" size={16} color={theme.colors.onSurfaceVariant} />
                            </Pressable>
                            <Text
                                variant="titleSmall"
                                style={[styles.qtyText, { color: theme.colors.primary }]}
                            >
                                {selected.quantity}
                            </Text>
                            <Pressable
                                onPress={() => updateQuantity(item.id, 1)}
                                hitSlop={8}
                                style={[styles.qtyButton, { backgroundColor: theme.colors.primaryContainer }]}
                            >
                                <AppIcon name="plus" size={16} color={theme.colors.primary} />
                            </Pressable>
                        </View>
                    ) : (
                        <AppIcon name="plus" size={18} color={theme.colors.onSurfaceVariant} />
                    )}
                </View>
            </TouchableOpacity>
        );
    }, [cartProductIds, selectedItems, theme, t, toggleProduct, updateQuantity]);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('common:loading')}
                </Text>
            </View>
        );
    }

    if (popularProducts.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('popularProducts')}
                </Text>
                {selectedItems.size > 0 && (
                    <Badge style={{ backgroundColor: theme.colors.primary }}>
                        {selectedItems.size}
                    </Badge>
                )}
            </View>

            <Divider />

            <View style={styles.listContainer}>
                <FlatList<Product>
                    data={popularProducts}
                    renderItem={renderProduct}
                    keyExtractor={(item: Product) => item.id}
                    extraData={[Array.from(selectedItems.keys()), cartProductIds]}
                    ItemSeparatorComponent={() => <Divider />}
                />
            </View>

            {selectedItems.size > 0 && (
                <View style={[styles.addBar, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.onPrimaryContainer, flex: 1 }}
                    >
                        {t('selectedCount', { count: totalSelectedCount })}
                    </Text>
                    <Button
                        mode="contained"
                        onPress={handleAddAll}
                        icon={paperIcon('cart-outline')}
                        compact
                    >
                        {t('addToCart')}
                    </Button>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
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
    actionSection: {
        width: 90,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    qtyButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        minWidth: 20,
        textAlign: 'center',
        fontWeight: '700',
    },
    addBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
});
