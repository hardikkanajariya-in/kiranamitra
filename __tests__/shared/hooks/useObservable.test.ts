import { renderHook, act } from '@testing-library/react-native';
import { useObservable } from '@shared/hooks/useObservable';
import { Subject, of, throwError } from 'rxjs';

describe('useObservable', () => {
    it('should return undefined with no initial value and undefined observable', () => {
        const { result } = renderHook(() => useObservable(undefined));
        expect(result.current).toBeUndefined();
    });

    it('should return initial value', () => {
        const { result } = renderHook(() => useObservable(undefined, 'default'));
        expect(result.current).toBe('default');
    });

    it('should receive values from observable', () => {
        const subject = new Subject<string>();
        const { result } = renderHook(() => useObservable(subject));

        act(() => subject.next('hello'));
        expect(result.current).toBe('hello');

        act(() => subject.next('world'));
        expect(result.current).toBe('world');
    });

    it('should work with of() observable', () => {
        const { result } = renderHook(() => useObservable(of(42)));
        expect(result.current).toBe(42);
    });

    it('should handle errors gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const errorObs = throwError(() => new Error('test error'));

        const { result } = renderHook(() => useObservable(errorObs, 'fallback'));

        expect(consoleSpy).toHaveBeenCalledWith('useObservable error:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    it('should unsubscribe on unmount', () => {
        const subject = new Subject<string>();
        const { unmount } = renderHook(() => useObservable(subject));

        expect(subject.observed).toBe(true);
        unmount();
        expect(subject.observed).toBe(false);
    });

    it('should reset to initial value when observable becomes null', () => {
        const subject = new Subject<string>();
        const { result, rerender } = renderHook(
            ({ obs }: { obs: any }) => useObservable(obs, 'default'),
            { initialProps: { obs: subject as any } },
        );

        act(() => subject.next('value'));
        expect(result.current).toBe('value');

        rerender({ obs: null });
        expect(result.current).toBe('default');
    });
});
