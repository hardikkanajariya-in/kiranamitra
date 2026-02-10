import React from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@shared/components/Icon';
import Category from '@core/database/models/Category';

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
                                ? theme.colors.primary
                                : theme.colors.surfaceVariant,
                            borderColor: isAllSelected
                                ? theme.colors.primary
                                : theme.colors.outline,
                        },
                    ]}
                >
                    <AppIcon
                        name="package-variant"
                        size={16}
                        color={isAllSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
                    />
                    <Text
                        variant="labelMedium"
                        style={{
                            color: isAllSelected
                                ? theme.colors.onPrimary
                                : theme.colors.onSurfaceVariant,
                        }}
                    >
                        {t('allCategories')}
                    </Text>
                    {totalProducts > 0 ? (
                        <View
                            style={[
                                styles.countBadge,
                                {
                                    backgroundColor: isAllSelected
                                        ? theme.colors.onPrimary + '40'
                                        : theme.colors.surface,
                                },
                            ]}
                        >
                            <Text
                                variant="labelSmall"
                                style={{
                                    color: isAllSelected
                                        ? theme.colors.onPrimary
                                        : theme.colors.onSurfaceVariant,
                                }}
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
                                        ? theme.colors.primary
                                        : theme.colors.surfaceVariant,
                                    borderColor: isSelected
                                        ? theme.colors.primary
                                        : theme.colors.outline,
                                },
                            ]}
                        >
                            {category.icon ? (
                                <AppIcon
                                    name={category.icon}
                                    size={16}
                                    color={isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
                                />
                            ) : null}
                            <Text
                                variant="labelMedium"
                                style={{
                                    color: isSelected
                                        ? theme.colors.onPrimary
                                        : theme.colors.onSurface,
                                }}
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
                                                ? theme.colors.onPrimary + '40'
                                                : theme.colors.surface,
                                        },
                                    ]}
                                >
                                    <Text
                                        variant="labelSmall"
                                        style={{
                                            color: isSelected
                                                ? theme.colors.onPrimary
                                                : theme.colors.onSurfaceVariant,
                                        }}
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
    countBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
});
