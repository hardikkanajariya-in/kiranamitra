import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { paperIcon } from '@shared/components/Icon';
import Category from '@core/database/models/Category';

interface CategoryFilterProps {
    categories: Category[];
    selectedCategoryId?: string;
    onSelect: (categoryId?: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategoryId,
    onSelect,
}) => {
    const { t } = useTranslation('products');

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <Chip
                selected={!selectedCategoryId}
                onPress={() => onSelect(undefined)}
                style={styles.chip}
                mode="outlined"
            >
                {t('allCategories')}
            </Chip>
            {categories.map((category) => (
                <Chip
                    key={category.id}
                    selected={selectedCategoryId === category.id}
                    onPress={() =>
                        onSelect(selectedCategoryId === category.id ? undefined : category.id)
                    }
                    style={styles.chip}
                    mode="outlined"
                    icon={paperIcon(category.icon)}
                >
                    {category.name}
                </Chip>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
    },
    chip: {
        marginRight: 4,
    },
});
