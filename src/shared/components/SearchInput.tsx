import React, { useState, useCallback } from 'react';
import { Searchbar } from 'react-native-paper';
import { useDebounce } from '@shared/hooks/useDebounce';
import { StyleSheet } from 'react-native';
import { paperIcon } from './Icon';

export interface SearchInputProps {
  placeholder: string;
  onSearch?: (query: string) => void;
  value?: string;
  onChangeText?: (text: string) => void;
  delay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onSearch,
  value: controlledValue,
  onChangeText,
  delay = 300,
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalQuery;

  const setQuery = useCallback((text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setInternalQuery(text);
    }
  }, [onChangeText]);

  const debouncedQuery = useDebounce(query, delay);

  React.useEffect(() => {
    onSearch?.(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={setQuery}
      value={query}
      onClearIconPress={handleClear}
      icon={paperIcon('search')}
      clearIcon={paperIcon('x')}
      style={styles.searchbar}
      inputStyle={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  searchbar: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 1,
  },
  input: {
    fontSize: 14,
  },
});
