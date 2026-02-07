import React from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@shared/components/Icon';
import Category from '@core/database/models/Category';
import { Colors } from '@core/theme/colors';

interface CategoryFilterProps {
    categories: Category[];
    selectedCategoryId?: string;
    onSelect: (categoryId?: string) => void;
    productCountByCategory?: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategoryId,
    onSelect,
    productCountByCategory = {},
}) => {
    const { t } = useTranslation('products');
    const theme = useTheme();

    const totalProducts = Object.values(productCountByCategory).reduce((sum, c) => sum + c, 0);
    const isAllSelected = !selectedCategoryId;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.container}
        >
            {/* All Categories Pill */}
            <Pressable onPress={() => onSelect(undefined)}>
                <View
                    style={[
                        styles.pill,
                        {
                            backgroundColor: isAllSelected
                                ? Colors.primary
                                : theme.colors.surfaceVariant,
                            borderColor: isAllSelected
                                ? Colors.primary
                                : theme.colors.outline,
                        },
                    ]}
                >
                    <AppIcon
                        name="package-variant"
                        size={16}
                        color={isAllSelected ? Colors.onPrimary : theme.colors.onSurfaceVariant}
                    />
                    <Text
                        style={[
                            styles.pillText,
                            {
                                color: isAllSelected
                                    ? Colors.onPrimary
                                    : theme.colors.onSurfaceVariant,
                            },
                        ]}
                    >
                        {t('allCategories')}
                    </Text>
                    {totalProducts > 0 ? (
                        <View
                            style={[
                                styles.countBadge,
                                {
                                    backgroundColor: isAllSelected
                                        ? 'rgba(255,255,255,0.25)'
                                        : theme.colors.surface,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.countText,
                                    {
                                        color: isAllSelected
                                            ? Colors.onPrimary
                                            : theme.colors.onSurfaceVariant,
                                    },
                                ]}
                            >
                                {totalProducts}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </Pressable>

            {categories.map((category) => {
                const isSelected = selectedCategoryId === category.id;
                const count = productCountByCategory[category.id] || 0;

                return (
                    <Pressable
                        key={category.id}
                        onPress={() =>
                            onSelect(isSelected ? undefined : category.id)
                        }
                    >
                        <View
                            style={[
                                styles.pill,
                                {
                                    backgroundColor: isSelected
                                        ? Colors.primary
                                        : theme.colors.surfaceVariant,
                                    borderColor: isSelected
                                        ? Colors.primary
                                        : theme.colors.outline,
                                },
                            ]}
                        >
                            {category.icon ? (
                                <AppIcon
                                    name={category.icon}
                                    size={16}
                                    color={isSelected ? Colors.onPrimary : theme.colors.onSurfaceVariant}
                                />
                            ) : null}
                            <Text
                                style={[
                                    styles.pillText,
                                    {
                                        color: isSelected
                                            ? Colors.onPrimary
                                            : theme.colors.onSurface,
                                    },
                                ]}
                                numberOfLines={1}
                            >
                                {category.name}
                            </Text>
                            {count > 0 ? (
                                <View
                                    style={[
                                        styles.countBadge,
                                        {
                                            backgroundColor: isSelected
                                                ? 'rgba(255,255,255,0.25)'
                                                : theme.colors.surface,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.countText,
                                            {
                                                color: isSelected
                                                    ? Colors.onPrimary
                                                    : theme.colors.onSurfaceVariant,
                                            },
                                        ]}
                                    >
                                        {count}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 0,
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    pillText: {
        fontSize: 13,
        fontWeight: '600',
    },
    countBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    countText: {
        fontSize: 10,
        fontWeight: '700',
    },
});
