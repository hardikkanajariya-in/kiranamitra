import React from 'react';
import { render } from '../../renderWithProviders';
import { StockLevelIndicator } from '@features/inventory/components/StockLevelIndicator';

describe('StockLevelIndicator', () => {
    it('should render current stock with unit', () => {
        const { getByText } = render(
            <StockLevelIndicator currentStock={50} lowStockThreshold={10} unit="kg" />
        );
        expect(getByText('50 kg')).toBeTruthy();
    });

    it('should render min stock threshold', () => {
        const { getByText } = render(
            <StockLevelIndicator currentStock={50} lowStockThreshold={10} unit="kg" />
        );
        expect(getByText('minStock')).toBeTruthy();
    });

    it('should render with zero stock', () => {
        render(<StockLevelIndicator currentStock={0} lowStockThreshold={10} unit="pcs" />);
    });

    it('should render with stock below threshold', () => {
        render(<StockLevelIndicator currentStock={5} lowStockThreshold={10} unit="kg" />);
    });

    it('should handle zero threshold', () => {
        render(<StockLevelIndicator currentStock={0} lowStockThreshold={0} unit="kg" />);
    });
});
