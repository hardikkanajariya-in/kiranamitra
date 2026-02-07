import React from 'react';
import { render } from '../../renderWithProviders';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';

describe('LoadingOverlay', () => {
    it('should render when visible', () => {
        const { UNSAFE_root } = render(<LoadingOverlay visible />);
        expect(UNSAFE_root).toBeTruthy();
    });

    it('should not render when not visible', () => {
        const { toJSON } = render(<LoadingOverlay visible={false} />);
        expect(toJSON()).toBeNull();
    });
});
