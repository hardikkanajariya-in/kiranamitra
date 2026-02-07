import React from 'react';
import { render } from '../../renderWithProviders';
import { PaymentModeSelector } from '@features/billing/components/PaymentModeSelector';

describe('PaymentModeSelector', () => {
    it('should render all payment modes', () => {
        const { getByText } = render(
            <PaymentModeSelector value="cash" onChange={jest.fn()} />
        );
        expect(getByText('cash')).toBeTruthy();
        expect(getByText('upi')).toBeTruthy();
        expect(getByText('card')).toBeTruthy();
        expect(getByText('credit')).toBeTruthy();
    });

    it('should hide credit when showCredit is false', () => {
        const { queryByText } = render(
            <PaymentModeSelector value="cash" onChange={jest.fn()} showCredit={false} />
        );
        expect(queryByText('credit')).toBeNull();
    });

    it('should render with selected value', () => {
        render(<PaymentModeSelector value="upi" onChange={jest.fn()} />);
    });
});
