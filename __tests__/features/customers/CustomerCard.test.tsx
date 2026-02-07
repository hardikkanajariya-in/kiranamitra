import React from 'react';
import { render } from '../../renderWithProviders';
import { CustomerCard } from '@features/customers/components/CustomerCard';

describe('CustomerCard', () => {
    it('should render customer name', () => {
        const { getByText } = render(
            <CustomerCard name="Raj Kumar" phone="9876543210" onPress={jest.fn()} />
        );
        expect(getByText('Raj Kumar')).toBeTruthy();
    });

    it('should render phone number', () => {
        const { getByText } = render(
            <CustomerCard name="Raj Kumar" phone="9876543210" onPress={jest.fn()} />
        );
        expect(getByText('9876543210')).toBeTruthy();
    });

    it('should render initials avatar', () => {
        const { getByText } = render(
            <CustomerCard name="Raj Kumar" phone="" onPress={jest.fn()} />
        );
        expect(getByText('RK')).toBeTruthy();
    });

    it('should render outstanding credit', () => {
        render(
            <CustomerCard name="Raj" phone="123" outstandingCredit={500} onPress={jest.fn()} />
        );
    });

    it('should render call button when phone and onCall provided', () => {
        render(
            <CustomerCard name="Raj" phone="123" onPress={jest.fn()} onCall={jest.fn()} />
        );
    });
});
