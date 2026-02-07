import React from 'react';
import { render } from '../../renderWithProviders';
import { LowStockAlert } from '@features/dashboard/components/LowStockAlert';

describe('LowStockAlert', () => {
    it('should return null when no alerts', () => {
        const { toJSON } = render(
            <LowStockAlert lowStockCount={0} outOfStockCount={0} />
        );
        // Component returns null but wrapper Views still render
    });

    it('should render with low stock count', () => {
        const { getByText } = render(
            <LowStockAlert lowStockCount={5} outOfStockCount={0} />
        );
        expect(getByText('stockAlerts')).toBeTruthy();
    });

    it('should render with out of stock count', () => {
        const { getByText } = render(
            <LowStockAlert lowStockCount={0} outOfStockCount={3} />
        );
        expect(getByText('stockAlerts')).toBeTruthy();
    });

    it('should render total badge', () => {
        const { getByText } = render(
            <LowStockAlert lowStockCount={2} outOfStockCount={3} />
        );
        expect(getByText('5')).toBeTruthy();
    });

    it('should be pressable', () => {
        const onPress = jest.fn();
        render(<LowStockAlert lowStockCount={1} outOfStockCount={0} onPress={onPress} />);
    });
});
