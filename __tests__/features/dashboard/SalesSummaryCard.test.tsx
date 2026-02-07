import React from 'react';
import { render } from '../../renderWithProviders';
import { SalesSummaryCard } from '@features/dashboard/components/SalesSummaryCard';

describe('SalesSummaryCard', () => {
    it('should render sales summary header', () => {
        const { getByText } = render(
            <SalesSummaryCard todaySales={5000} todayBillCount={10} monthSales={50000} />
        );
        expect(getByText('salesSummary')).toBeTruthy();
    });

    it('should render today sales label', () => {
        const { getByText } = render(
            <SalesSummaryCard todaySales={5000} todayBillCount={10} monthSales={50000} />
        );
        expect(getByText('todaySales')).toBeTruthy();
    });

    it('should render month sales label', () => {
        const { getByText } = render(
            <SalesSummaryCard todaySales={5000} todayBillCount={10} monthSales={50000} />
        );
        expect(getByText('monthSales')).toBeTruthy();
    });

    it('should render bill count', () => {
        const { getByText } = render(
            <SalesSummaryCard todaySales={0} todayBillCount={5} monthSales={0} />
        );
        expect(getByText('billCount_5')).toBeTruthy();
    });
});
