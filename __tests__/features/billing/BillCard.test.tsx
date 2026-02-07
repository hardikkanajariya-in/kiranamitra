import React from 'react';
import { render } from '../../renderWithProviders';
import { BillCard } from '@features/billing/components/BillCard';

describe('BillCard', () => {
    const defaultProps = {
        billNumber: 'B001',
        grandTotal: 1500,
        paymentMode: 'cash',
        status: 'completed',
        createdAt: Date.now(),
        onPress: jest.fn(),
    };

    it('should render bill number', () => {
        const { getByText } = render(<BillCard {...defaultProps} />);
        expect(getByText('#B001')).toBeTruthy();
    });

    it('should render with customer name', () => {
        const { getByText } = render(<BillCard {...defaultProps} customerName="Raj" />);
        expect(getByText('Raj')).toBeTruthy();
    });

    it('should render payment mode badge', () => {
        const { getByText } = render(<BillCard {...defaultProps} />);
        expect(getByText('CASH')).toBeTruthy();
    });

    it('should render cancelled status', () => {
        render(<BillCard {...defaultProps} status="cancelled" />);
    });
});
