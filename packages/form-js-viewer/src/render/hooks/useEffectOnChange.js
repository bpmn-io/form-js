import { useEffect } from 'react';
import { usePrevious } from './usePrevious';

function useEffectOnChange(value, callback, dependencies = []) {
  const previousValue = usePrevious(value);

  useEffect(() => {
    if (value !== previousValue) {
      callback();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ value, ...dependencies ]);
}

export { useEffectOnChange };
