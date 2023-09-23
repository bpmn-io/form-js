import useService from './useService';
import useFilteredFormData from './useFilteredFormData';
import LocalExpressionContext from '../context/LocalExpressionContext';
import { useContext, useMemo } from 'preact/hooks';
import { wrapExpressionContext } from '../../util';

/**
 * Evaluate a string reactively based on the expressionLanguage and form data.
 * If the string is not an expression, it is returned as is.
 * The function is memoized to minimize re-renders.
 *
 * @param {string} value - The string to evaluate.
 * @returns {any} - Evaluated value or the original value if not an expression.
 */
export default function useExpressionEvaluation(value) {

  const filteredData = useFilteredFormData();
  const localExpressionContext = useContext(LocalExpressionContext);
  const expressionLanguage = useService('expressionLanguage');

  const expressionContext = useMemo(() => {
    if (localExpressionContext) {
      wrapExpressionContext(filteredData, localExpressionContext);
    }
    return filteredData;
  }, [ filteredData, localExpressionContext ]);

  return useMemo(() => {
    if (expressionLanguage && expressionLanguage.isExpression(value)) {
      return expressionLanguage.evaluate(value, expressionContext);
    }
    return value;
  }, [ expressionLanguage, expressionContext, value ]);
}
