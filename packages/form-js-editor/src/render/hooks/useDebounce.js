import {
  useMemo,
  useEffect
} from 'preact/hooks';

import useService from './useService';


export default function useDebounce(fn, dependencies = []) {

  const debounce = useService('debounce');

  const callback = useMemo(() => {
    return debounce(fn);
  }, dependencies);

  // cleanup async side-effect if callback #flush is provided.
  useEffect(() => {
    return () => {
      (typeof callback.flush === 'function') && callback.flush();
    };
  }, [ callback ]);

  return callback;
}