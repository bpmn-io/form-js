import {
  useMemo,
  useEffect
} from 'preact/hooks';

import { useService } from './useService';

/**
 * @param {Function} fn - function to debounce
 */
export function useDebounce(fn) {

  const debounce = useService('debounce');

  const callback = useMemo(() => {
    return debounce(fn);
  }, [ debounce, fn ]);

  // cleanup async side-effect if callback #flush is provided.
  useEffect(() => {
    return () => {
      (typeof callback.flush === 'function') && callback.flush();
    };
  }, [ callback ]);

  return callback;
}