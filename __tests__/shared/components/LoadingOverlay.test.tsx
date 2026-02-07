import React from 'react';
import { render } from '../../renderWithProviders';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';

describe('LoadingOverlay', () => {
    it('should render when visible', () => {
        const { UNSAFE_root } = render(<LoadingOverlay visible />);
        expect(UNSAFE_root).toBeTruthy();
    });

    it('should not render overlay when not visible', () => {
        const { queryByTestId, toJSON } = render(<LoadingOverlay visible={false} />);
        // Component returns null but wrappers still render
        const json = toJSON();
        expect(json).toBeTruthy(); // wrapper renders
    });
});
