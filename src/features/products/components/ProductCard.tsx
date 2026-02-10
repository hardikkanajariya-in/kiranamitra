import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme, ProgressBar, Surface } from 'react-native-paper';
import { CurrencyText } from '@shared/components/CurrencyText';
import { AppIcon } from '@shared/components/Icon';
import { useTranslation } from 'react-i18next';
import { CURRENCY_SYMBOL } from '@core/constants';

interface ProductCardProps {
    name: string;
    sellingPrice: number;
    purchasePrice?: number;
    currentStock: number;
    lowStockThreshold?: number;
    unit: string;
    barcode?: string;
    categoryName?: string;
    isLowStock: boolean;
    isOutOfStock: boolean;
    onPress: () => void;
    onLongPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    name,
    sellingPrice,
    purchasePrice,
    currentStock,
    lowStockThreshold = 10,
    unit,
    barcode,
    categoryName,
    isLowStock,
    isOutOfStock,
    onPress,
    onLongPress,
}) => {
    const theme = useTheme();
    const { t } = useTranslation('products');

    const getStockColor = (): string => {
        if (isOutOfStock) { return theme.colors.error; }
        if (isLowStock) { return theme.colors.tertiary; }
        return theme.colors.primary;
    };

    const getStockBgColor = (): string => {
        if (isOutOfStock) { return theme.colors.errorContainer; }
        if (isLowStock) { return theme.colors.tertiaryContainer; }
        return theme.colors.primaryContainer;
    };

    const getStockLabel = (): string => {
        if (isOutOfStock) { return t('outOfStock'); }
        if (isLowStock) { return t('lowStock'); }
        return t('inventory:inStock');
    };

    const maxDisplay = Math.max(lowStockThreshold * 3, currentStock, 1);
    const stockProgress = Math.min(currentStock / maxDisplay, 1);

    const profit = purchasePrice !== undefined && purchasePrice > 0
        ? sellingPrice - purchasePrice
        : undefined;

    const stockColor = getStockColor();
    const stockBgColor = getStockBgColor();

    return (
        <Pressable onPress={onPress} onLongPress={onLongPress}>
            <Surface
                style={[styles.card, { backgroundColor: theme.colors.surface }]}
                elevation={1}
            >
                {/* Top Row: Name + Stock Badge */}
                <View style={styles.topRow}>
                    <View style={styles.nameSection}>
                        <Text
                            variant="titleMedium"
                            style={[styles.name, { color: theme.colors.onSurface }]}
                            numberOfLines={1}
                        >
                            {name}
                        </Text>
                        {categoryName ? (
                            <View style={[styles.categoryBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
                                <Text
                                    variant="labelSmall"
                                    style={{ color: theme.colors.onSurfaceVariant }}
                                    numberOfLines={1}
                                >
                                    {categoryName}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                    <View style={[styles.stockBadge, { backgroundColor: stockBgColor }]}>
                        <View style={[styles.stockDot, { backgroundColor: stockColor }]} />
                        <Text style={[styles.stockBadgeText, { color: stockColor }]}>
                            {getStockLabel()}
                        </Text>
                    </View>
                </View>

                {/* Middle Row: Price + Profit */}
                <View style={styles.priceRow}>
                    <View style={styles.priceSection}>
                        <CurrencyText amount={sellingPrice} variant="titleMedium" />
                        {purchasePrice !== undefined && purchasePrice > 0 ? (
                            <Text
                                variant="bodySmall"
                                style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}
                            >
                                cost {CURRENCY_SYMBOL}{purchasePrice.toFixed(0)}
                            </Text>
                        ) : null}
                    </View>
                    {profit !== undefined && profit > 0 ? (
                        <View style={[styles.profitBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                            <AppIcon name="chart-line" size={12} color={theme.colors.primary} />
                            <Text style={[styles.profitText, { color: theme.colors.primary }]}>
                                +{CURRENCY_SYMBOL}{profit.toFixed(0)}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* Bottom Row: Stock bar + quantity */}
                <View style={styles.stockRow}>
                    <View style={styles.stockBarSection}>
                        <ProgressBar
                            progress={stockProgress}
                            color={stockColor}
                            style={[styles.stockBar, { backgroundColor: theme.colors.surfaceVariant }]}
                        />
                    </View>
                    <Text
                        variant="labelMedium"
                        style={[styles.stockQuantity, { color: stockColor }]}
                    >
                        {currentStock} {unit}
                    </Text>
                </View>

                {/* Barcode indicator */}
                {barcode ? (
                    <View style={styles.barcodeRow}>
                        <AppIcon name="barcode" size={12} color={theme.colors.onSurfaceVariant} />
                        <Text
                            variant="bodySmall"
                            style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}
                            numberOfLines={1}
                        >
                            {barcode}
                        </Text>
                    </View>
                ) : null}
            </Surface>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 12,
        padding: 14,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    nameSection: {
        flex: 1,
        marginRight: 12,
    },
    name: {
        fontWeight: '600',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    stockDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5,
    },
    stockBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    priceSection: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flex: 1,
    },
    profitBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 4,
    },
    profitText: {
        fontSize: 11,
        fontWeight: '700',
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    stockBarSection: {
        flex: 1,
    },
    stockBar: {
        height: 6,
        borderRadius: 3,
    },
    stockQuantity: {
        fontWeight: '600',
        minWidth: 50,
        textAlign: 'right',
    },
    barcodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        opacity: 0.6,
    },
});
