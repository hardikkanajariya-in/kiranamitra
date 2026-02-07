import React from 'react';
import { render } from '../renderWithProviders';
import { MoreMenuScreen } from '../../src/navigation/screens/MoreMenuScreen';

describe('MoreMenuScreen', () => {
    const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
    };

    it('should render more menu title', () => {
        const { getByText } = render(<MoreMenuScreen navigation={mockNavigation} />);
        expect(getByText('more')).toBeTruthy();
    });

    it('should render reports option', () => {
        const { getByText } = render(<MoreMenuScreen navigation={mockNavigation} />);
        expect(getByText('reports')).toBeTruthy();
    });

    it('should render settings option', () => {
        const { getByText } = render(<MoreMenuScreen navigation={mockNavigation} />);
        expect(getByText('settings')).toBeTruthy();
    });
});
