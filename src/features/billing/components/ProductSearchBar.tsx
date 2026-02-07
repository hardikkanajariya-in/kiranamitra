import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, useTheme, Text, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { paperIcon } from '@shared/components/Icon';
import { useDebounce } from '@shared/hooks/useDebounce';
import Product from '@core/database/models/Product';
import { productRepository } from '@features/products/repositories/productRepository';
import { formatCurrency } from '@shared/utils/currency';

interface ProductSearchBarProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ onSelectProduct }) => {
  const theme = useTheme();
  const { t } = useTranslation('billing');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      return;
    }

    const subscription = productRepository
      .search(debouncedQuery)
      .subscribe((products) => {
        setResults(products);
        setShowResults(true);
      });
    return () => subscription.unsubscribe();
  }, [debouncedQuery]);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        value={query}
        onChangeText={handleQueryChange}
        placeholder={t('searchProducts')}
        left={<TextInput.Icon icon={paperIcon('magnify')} />}
        right={query ? <TextInput.Icon icon={paperIcon('close')} onPress={() => handleQueryChange('')} /> : undefined}
        style={styles.input}
      />

      {showResults && results.length > 0 && (
        <View style={[styles.dropdown, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
          {results.slice(0, 5).map((product, index) => (
            <React.Fragment key={product.id}>
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelect(product)}
              >
                <View style={styles.resultInfo}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {product.name}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('inventory:currentStockLabel', { count: product.currentStock, unit: product.unit })}
                  </Text>
                </View>
                <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
                  {formatCurrency(product.sellingPrice)}
                </Text>
              </TouchableOpacity>
              {index < results.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
  },
  input: {
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    top: 64,
    left: 16,
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
});
