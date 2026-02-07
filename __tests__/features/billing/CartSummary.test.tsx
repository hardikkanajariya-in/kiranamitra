import React from 'react';
import { render } from '../../renderWithProviders';
import { CartSummary } from '@features/billing/components/CartSummary';

describe('CartSummary', () => {
    it('should render subtotal and total', () => {
        const { getByText } = render(
            <CartSummary subtotal={1000} discount={0} grandTotal={1000} itemCount={3} />
        );
        expect(getByText('subtotal (3 items)')).toBeTruthy();
        expect(getByText('total')).toBeTruthy();
    });

    it('should render with discount', () => {
        const { getByText } = render(
            <CartSummary subtotal={1000} discount={100} grandTotal={900} itemCount={3} />
        );
        expect(getByText('discount')).toBeTruthy();
    });

    it('should not show discount when zero', () => {
        const { queryByText } = render(
            <CartSummary subtotal={500} discount={0} grandTotal={500} itemCount={2} />
        );
        expect(queryByText('discount')).toBeNull();
    });
});
