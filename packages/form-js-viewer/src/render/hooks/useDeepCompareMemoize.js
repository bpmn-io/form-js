import { useRef } from 'preact/hooks';
import isEqual from 'lodash/isEqual';

/**
 * A custom hook to manage state changes with deep comparison.
 *
 * @template T
 * @param {T} value - The current value to manage.
 * @returns {T} - Returns the current state.
 */
export function useDeepCompareMemoize(value) {
  const ref = useRef();

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}