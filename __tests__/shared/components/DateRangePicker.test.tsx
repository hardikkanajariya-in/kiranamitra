import React from 'react';
import { render } from '../../renderWithProviders';
import { DateRangePicker } from '@shared/components/DateRangePicker';

describe('DateRangePicker', () => {
    const defaultProps = {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
        onChange: jest.fn(),
    };

    it('should render with from and to inputs', () => {
        const { getByDisplayValue } = render(<DateRangePicker {...defaultProps} />);
        expect(getByDisplayValue('01/01/2024')).toBeTruthy();
        expect(getByDisplayValue('31/01/2024')).toBeTruthy();
    });

    it('should render quick select buttons', () => {
        const { getByText } = render(<DateRangePicker {...defaultProps} />);
        expect(getByText('today')).toBeTruthy();
    });

    it('should render the arrow separator', () => {
        const { getByText } = render(<DateRangePicker {...defaultProps} />);
        expect(getByText('→')).toBeTruthy();
    });
});
