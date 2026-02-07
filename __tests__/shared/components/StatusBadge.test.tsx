import React from 'react';
import { render } from '../../renderWithProviders';
import { StatusBadge } from '@shared/components/StatusBadge';

describe('StatusBadge', () => {
    it('should render with label', () => {
        const { getByText } = render(<StatusBadge label="Active" />);
        expect(getByText('Active')).toBeTruthy();
    });

    it('should render success type', () => {
        render(<StatusBadge label="Completed" type="success" />);
    });

    it('should render warning type', () => {
        render(<StatusBadge label="Low Stock" type="warning" />);
    });

    it('should render error type', () => {
        render(<StatusBadge label="Cancelled" type="error" />);
    });

    it('should render info type', () => {
        render(<StatusBadge label="Info" type="info" />);
    });

    it('should render neutral type by default', () => {
        render(<StatusBadge label="Default" />);
    });

    it('should accept variant prop as alias for type', () => {
        render(<StatusBadge label="Test" variant="success" />);
    });

    it('should render compact badge', () => {
        render(<StatusBadge label="Compact" type="success" compact />);
    });
});
