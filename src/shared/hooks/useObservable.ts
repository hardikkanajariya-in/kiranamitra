import { useState, useEffect, useRef } from 'react';
import type { Observable, Subscription } from 'rxjs';

/**
 * Custom hook to subscribe to RxJS Observables from WatermelonDB.
 * Bridges WatermelonDB's reactive queries with functional React components.
 */
export function useObservable<T>(observable: Observable<T> | undefined | null): T | undefined;
export function useObservable<T>(observable: Observable<T> | undefined | null, initialValue: T): T;
export function useObservable<T>(
  observable: Observable<T> | undefined | null,
  initialValue?: T,
): T | undefined {
  const [value, setValue] = useState<T | undefined>(initialValue);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    if (!observable) {
      setValue(initialValue);
      return;
    }

    subscriptionRef.current = observable.subscribe({
      next: (val) => setValue(val),
      error: (err) => {
        // eslint-disable-next-line no-console
        console.error('useObservable error:', err);
      },
    });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [observable]);

  return value;
}
