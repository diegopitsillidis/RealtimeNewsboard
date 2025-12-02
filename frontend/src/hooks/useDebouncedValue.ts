import { useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

export function useDebouncedValue<T>(value: T, delayMs: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  const subjectRef = useRef(new Subject<T>());

  useEffect(() => {
    const subscription = subjectRef.current
      .pipe(debounceTime(delayMs), distinctUntilChanged())
      .subscribe(setDebounced);

    // seed
    subjectRef.current.next(value);

    return () => subscription.unsubscribe();
  }, [delayMs]);

  useEffect(() => {
    subjectRef.current.next(value);
  }, [value]);

  return debounced;
}
