import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '@shared/hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
    afterAll(() => {
        jest.useRealTimers();
    });

    it('should return initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('hello', 300));
        expect(result.current).toBe('hello');
    });

    it('should debounce value changes', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: 'initial' } },
        );

        expect(result.current).toBe('initial');

        rerender({ value: 'changed' });
        expect(result.current).toBe('initial'); // not yet updated

        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(result.current).toBe('changed');
    });

    it('should cancel previous timer on rapid changes', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: 'a' } },
        );

        rerender({ value: 'b' });
        act(() => {
            jest.advanceTimersByTime(100);
        });
        rerender({ value: 'c' });
        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(result.current).toBe('c');
    });

    it('should use default delay of 300ms', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value),
            { initialProps: { value: 'start' } },
        );

        rerender({ value: 'end' });

        act(() => {
            jest.advanceTimersByTime(299);
        });
        expect(result.current).toBe('start');

        act(() => {
            jest.advanceTimersByTime(1);
        });
        expect(result.current).toBe('end');
    });

    it('should work with number type', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 100),
            { initialProps: { value: 0 } },
        );

        rerender({ value: 42 });
        act(() => {
            jest.advanceTimersByTime(100);
        });
        expect(result.current).toBe(42);
    });
});
