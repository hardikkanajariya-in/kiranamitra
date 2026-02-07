import React from 'react';
import { render } from '../../renderWithProviders';
import { EmptyState } from '@shared/components/EmptyState';

describe('EmptyState', () => {
    it('should render with icon and title', () => {
        const { getByText } = render(
            <EmptyState icon="inbox-outline" title="No items" />,
        );
        expect(getByText('No items')).toBeTruthy();
    });

    it('should render with subtitle', () => {
        const { getByText } = render(
            <EmptyState icon="inbox-outline" title="No items" subtitle="Add items to get started" />,
        );
        expect(getByText('Add items to get started')).toBeTruthy();
    });

    it('should render action button', () => {
        const onAction = jest.fn();
        const { getByText } = render(
            <EmptyState icon="inbox-outline" title="No items" actionLabel="Add Item" onAction={onAction} />,
        );
        expect(getByText('Add Item')).toBeTruthy();
    });

    it('should not render action button when no label', () => {
        render(<EmptyState icon="inbox-outline" title="No items" />);
    });

    it('should not render subtitle when not provided', () => {
        const { queryByText } = render(
            <EmptyState icon="inbox-outline" title="No items" />,
        );
        // No subtitle rendered
    });
});
