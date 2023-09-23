import useService from './useService.js';
import useFilteredFormData from './useFilteredFormData.js';
import { useContext, useMemo } from 'preact/hooks';
import LocalExpressionContext from '../context/LocalExpressionContext.js';
import { wrapExpressionContext } from '../../util';

/**
 * Evaluate if condition is met reactively based on the conditionChecker and form data.
 *
 * @param {string | undefined} condition
 *
 * @returns {boolean} true if condition is met or no condition or condition checker exists
 */
export default function useCondition(condition) {
  const conditionChecker = useService('conditionChecker', false);
  const filteredData = useFilteredFormData();

  const localContext = useContext(LocalExpressionContext);

  const expressionContext = useMemo(() => {

    if (localContext) {
      return wrapExpressionContext(filteredData, localContext);
    }

    return filteredData;

  }, [ filteredData, localContext ]);

  return useMemo(() => {
    return conditionChecker ? conditionChecker.check(condition, expressionContext) : null;
  }, [ conditionChecker, condition, expressionContext ]);
}
