import React from 'react';
import { render } from '../../renderWithProviders';
import { Logo } from '@shared/components/Logo';

describe('Logo', () => {
    it('should render full logo by default', () => {
        const { root } = render(<Logo />);
        expect(root).toBeTruthy();
    });

    it('should render icon-only variant', () => {
        const { root } = render(<Logo iconOnly />);
        expect(root).toBeTruthy();
    });

    it('should render with custom size', () => {
        const { root } = render(<Logo size={200} />);
        expect(root).toBeTruthy();
    });

    it('should render full logo with default size', () => {
        render(<Logo iconOnly={false} />);
    });
});
