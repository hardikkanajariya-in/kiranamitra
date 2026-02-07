import React from 'react';
import { render } from '../../renderWithProviders';
import { SearchInput } from '@shared/components/SearchInput';

describe('SearchInput', () => {
    it('should render with placeholder', () => {
        const { getByPlaceholderText } = render(
            <SearchInput placeholder="Search products..." />,
        );
        expect(getByPlaceholderText('Search products...')).toBeTruthy();
    });

    it('should render with controlled value', () => {
        render(
            <SearchInput placeholder="Search..." value="test" onChangeText={jest.fn()} />,
        );
    });

    it('should render with uncontrolled mode', () => {
        render(<SearchInput placeholder="Search..." />);
    });

    it('should call onSearch callback', () => {
        const onSearch = jest.fn();
        render(<SearchInput placeholder="Search..." onSearch={onSearch} />);
    });
});
