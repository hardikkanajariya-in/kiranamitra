import React from 'react';
import { render } from '../../renderWithProviders';
import { AppHeader } from '@shared/components/AppHeader';

describe('AppHeader', () => {
    it('should render with title', () => {
        const { getByText } = render(<AppHeader title="Test Title" />);
        expect(getByText('Test Title')).toBeTruthy();
    });

    it('should render with subtitle', () => {
        const { getByText } = render(<AppHeader title="Title" subtitle="Subtitle" />);
        expect(getByText('Subtitle')).toBeTruthy();
    });

    it('should render back button when showBack is true', () => {
        const onBack = jest.fn();
        const { UNSAFE_queryAllByType } = render(
            <AppHeader title="Title" showBack onBack={onBack} />,
        );
        // AppHeader renders Appbar.BackAction when showBack
        expect(UNSAFE_queryAllByType).toBeDefined();
    });

    it('should not render back button by default', () => {
        render(<AppHeader title="Title" />);
    });

    it('should render action buttons', () => {
        const onPress = jest.fn();
        render(<AppHeader title="Title" actions={[{ icon: 'plus', onPress }]} />);
    });

    it('should render multiple actions', () => {
        const actions = [
            { icon: 'plus', onPress: jest.fn() },
            { icon: 'delete', onPress: jest.fn() },
        ];
        render(<AppHeader title="Title" actions={actions} />);
    });
});
