import useService from './useService.js';
import { useContext, useMemo } from 'preact/hooks';
import { FilteredFormDataContext } from '../context/FilteredFormDataContextProvider.js';

/**
 * Evaluate if condition is met reactively based on the conditionChecker and form data.
 *
 * @param {string | undefined} condition
 *
 * @returns {boolean} true if condition is met or no condition or condition checker exists
 */
export default function useCondition(condition) {
  const conditionChecker = useService('conditionChecker', false);
  const filteredData = useContext(FilteredFormDataContext);

  return useMemo(() => {
    return conditionChecker ? conditionChecker.check(condition, filteredData) : null;
  }, [ conditionChecker, condition, filteredData ]);
}
