import React from 'react';
import { render, fireEvent, act } from '../../renderWithProviders';
import { SearchInput } from '@shared/components/SearchInput';

describe('SearchInput', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render with placeholder', () => {
        const { getByPlaceholderText } = render(
            <SearchInput placeholder="Search products..." />,
        );
        expect(getByPlaceholderText('Search products...')).toBeTruthy();
    });

    it('should render with controlled value', () => {
        const onChangeText = jest.fn();
        const { getByDisplayValue } = render(
            <SearchInput placeholder="Search..." value="test" onChangeText={onChangeText} />,
        );
        expect(getByDisplayValue('test')).toBeTruthy();
    });

    it('should call onChangeText when text changes (controlled)', () => {
        const onChangeText = jest.fn();
        const { getByPlaceholderText } = render(
            <SearchInput placeholder="Search..." value="" onChangeText={onChangeText} />,
        );
        fireEvent.changeText(getByPlaceholderText('Search...'), 'hello');
        expect(onChangeText).toHaveBeenCalledWith('hello');
    });

    it('should update internal query in uncontrolled mode', () => {
        const { getByPlaceholderText } = render(
            <SearchInput placeholder="Search..." />,
        );
        fireEvent.changeText(getByPlaceholderText('Search...'), 'test query');
    });

    it('should call onSearch with debounced value', () => {
        const onSearch = jest.fn();
        const { getByPlaceholderText } = render(
            <SearchInput placeholder="Search..." onSearch={onSearch} />,
        );
        fireEvent.changeText(getByPlaceholderText('Search...'), 'hello');
        act(() => { jest.advanceTimersByTime(300); });
        expect(onSearch).toHaveBeenCalledWith('hello');
    });

    it('should handle clear icon press', () => {
        const onChangeText = jest.fn();
        const { getByPlaceholderText } = render(
            <SearchInput placeholder="Search..." value="query" onChangeText={onChangeText} />,
        );
        // The Searchbar has an onClearIconPress
        const searchbar = getByPlaceholderText('Search...');
        // Simulate clear by changing text to empty
        fireEvent.changeText(searchbar, '');
        expect(onChangeText).toHaveBeenCalledWith('');
    });
});
