import useService from './useService';
import useFilteredFormData from './useFilteredFormData';
import { useMemo } from 'preact/hooks';

/**
 * Evaluate a string reactively based on the expressionLanguage and form data.
 * If the string is not an expression, it is returned as is.
 * Memoised to minimize re-renders.
 *
 * @param {string} value
 *
 */
export default function useExpressionEvaluation(value) {
  const formData = useFilteredFormData();
  const expressionLanguage = useService('expressionLanguage');

  return useMemo(() => {

    if (expressionLanguage && expressionLanguage.isExpression(value)) {
      return expressionLanguage.evaluate(value, formData);
    }

    return value;

  }, [ expressionLanguage, formData, value ]);
}
