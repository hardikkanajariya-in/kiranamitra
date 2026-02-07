import React from 'react';
import { render } from '../../renderWithProviders';
import { CurrencyText } from '@shared/components/CurrencyText';

describe('CurrencyText', () => {
    it('should render formatted currency', () => {
        const { getByText } = render(<CurrencyText amount={1000} />);
        expect(getByText('₹1,000.00')).toBeTruthy();
    });

    it('should render with large variant', () => {
        render(<CurrencyText amount={500} variant="large" />);
    });

    it('should render with small variant', () => {
        render(<CurrencyText amount={500} variant="small" />);
    });

    it('should render with paper variant', () => {
        render(<CurrencyText amount={500} variant="titleLarge" />);
    });

    it('should render with colored prop for positive amount', () => {
        render(<CurrencyText amount={100} colored />);
    });

    it('should render with colored prop for negative amount', () => {
        render(<CurrencyText amount={-100} colored />);
    });

    it('should render with custom color', () => {
        render(<CurrencyText amount={100} color="red" />);
    });

    it('should render zero amount', () => {
        const { getByText } = render(<CurrencyText amount={0} />);
        expect(getByText('₹0.00')).toBeTruthy();
    });

    it('should render negative amount', () => {
        const { getByText } = render(<CurrencyText amount={-500} />);
        expect(getByText('-₹500.00')).toBeTruthy();
    });
});
