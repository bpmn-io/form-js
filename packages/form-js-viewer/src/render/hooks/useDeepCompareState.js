import {
  useEffect,
  useState
} from 'preact/hooks';

import { usePrevious } from './usePrevious';
import isEqual from 'lodash/isEqual';

/**
 * A custom hook to manage state changes with deep comparison.
 *
 * @param {any} value - The current value to manage.
 * @param {any} defaultValue - The initial default value for the state.
 * @returns {any} - Returns the current state.
 */
export function useDeepCompareState(value, defaultValue) {

  const [ state, setState ] = useState(defaultValue);

  const previous = usePrevious(value, defaultValue);

  const changed = !isEqual(previous, value);

  useEffect(() => {
    if (changed) {
      setState(value);
    }
  }, [ changed, value ]);

  return state;
}