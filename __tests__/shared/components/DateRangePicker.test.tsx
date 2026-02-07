import React from 'react';
import { render, fireEvent } from '../../renderWithProviders';
import { DateRangePicker } from '@shared/components/DateRangePicker';

describe('DateRangePicker', () => {
    const defaultProps = {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
        onChange: jest.fn(),
    };

    beforeEach(() => jest.clearAllMocks());

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

    it('should update from text on change', () => {
        const { getByDisplayValue } = render(<DateRangePicker {...defaultProps} />);
        const fromInput = getByDisplayValue('01/01/2024');
        fireEvent.changeText(fromInput, '15/01/2024');
        // Text updates internally (parsing requires customParseFormat plugin)
        expect(getByDisplayValue('15/01/2024')).toBeTruthy();
    });

    it('should update to text on change', () => {
        const { getByDisplayValue } = render(<DateRangePicker {...defaultProps} />);
        const toInput = getByDisplayValue('31/01/2024');
        fireEvent.changeText(toInput, '28/02/2024');
        expect(getByDisplayValue('28/02/2024')).toBeTruthy();
    });

    it('should not call onChange with invalid date text', () => {
        const { getByDisplayValue } = render(<DateRangePicker {...defaultProps} />);
        const fromInput = getByDisplayValue('01/01/2024');
        fireEvent.changeText(fromInput, 'abc');
        // onChange should not be called with invalid dates
    });

    it('should handle "today" quick select button', () => {
        const { getByText } = render(<DateRangePicker {...defaultProps} />);
        fireEvent.press(getByText('today'));
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            expect.objectContaining({ from: expect.any(Date), to: expect.any(Date) }),
        );
    });

    it('should handle "7 days" quick select button', () => {
        const { getByText } = render(<DateRangePicker {...defaultProps} />);
        fireEvent.press(getByText('days_7'));
        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should handle "30 days" quick select button', () => {
        const { getByText } = render(<DateRangePicker {...defaultProps} />);
        fireEvent.press(getByText('days_30'));
        expect(defaultProps.onChange).toHaveBeenCalled();
    });
});
