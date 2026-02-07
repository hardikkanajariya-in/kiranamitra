import React from 'react';
import { render } from '../../renderWithProviders';
import { UdharSummaryCard } from '@features/dashboard/components/UdharSummaryCard';

describe('UdharSummaryCard', () => {
    it('should render udhar summary header', () => {
        const { getByText } = render(
            <UdharSummaryCard totalUdhar={10000} totalCustomers={5} />
        );
        expect(getByText('udharSummary')).toBeTruthy();
    });

    it('should render total outstanding label', () => {
        const { getByText } = render(
            <UdharSummaryCard totalUdhar={10000} totalCustomers={5} />
        );
        expect(getByText('totalOutstanding')).toBeTruthy();
    });

    it('should render customer count', () => {
        const { getByText } = render(
            <UdharSummaryCard totalUdhar={10000} totalCustomers={5} />
        );
        expect(getByText('5')).toBeTruthy();
    });

    it('should be pressable', () => {
        render(<UdharSummaryCard totalUdhar={100} totalCustomers={1} onPress={jest.fn()} />);
    });
});
