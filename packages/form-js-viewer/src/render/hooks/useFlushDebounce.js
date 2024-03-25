import { useCallback, useEffect, useRef } from 'preact/hooks';
import { useService } from './useService';

export function useFlushDebounce(func) {

  const timeoutRef = useRef(null);
  const lastArgsRef = useRef(null);

  const form = useService('form');
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

  }, [ func, delay, shouldDebounce ]);

  const flushFunc = useCallback(() => {

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (lastArgsRef.current !== null) {
        func(...lastArgsRef.current);
        lastArgsRef.current = null;
      }
    }

  }, [ func ]);

  // ensures debounce flushing on unrelated form changes
  useEffect(() => {
    if (form.on) {
      form.on('changed', flushFunc);
      return () => {
        form.off('changed', flushFunc);
      };
    }
  }, [ form, flushFunc ]);

  return [ debounceFunc, flushFunc ];
}
