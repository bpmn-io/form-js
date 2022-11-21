import { isString } from 'min-dash';

import useService from './useService';
import { useEvaluation } from './useEvaluation';

/**
 *
 * @param {string} value
 */
export function useExpressionValue(value) {
  const formData = useService('form')._getState().data;

  if (!isExpression(value)) {
    return value;
  }

  // We can ignore this hook rule as we do not use
  // state or effects in our custom hooks
  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  return useEvaluation(value, formData);
}


// helper ///////////////

function isExpression(value) {
  return isString(value) && value.startsWith('=');
}