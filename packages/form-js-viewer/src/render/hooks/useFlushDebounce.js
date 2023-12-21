import { useCallback, useRef } from 'preact/hooks';
import useService from './useService';

function useFlushDebounce(func, additionalDeps = []) {

  const timeoutRef = useRef(null);
  const lastArgsRef = useRef(null);

  const config = useService('config', false);
  const debounce = config && config.debounce;
  const shouldDebounce = debounce !== false && debounce !== 0;
  const delay = typeof debounce === 'number' ? debounce : 300;

  const debounceFunc = useCallback((...args) => {

    if (!shouldDebounce) {
      func(...args);
      return;
    }

    lastArgsRef.current = args;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      func(...lastArgsRef.current);
      lastArgsRef.current = null;
    }, delay);

  }, [ func, delay, shouldDebounce, ...additionalDeps ]);

  const flushFunc = useCallback(() => {

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      if (lastArgsRef.current !== null) {
        func(...lastArgsRef.current);
        lastArgsRef.current = null;
      }
      timeoutRef.current = null;
    }

  }, [ func, ...additionalDeps ]);

  return [ debounceFunc, flushFunc ];
}

export default useFlushDebounce;
