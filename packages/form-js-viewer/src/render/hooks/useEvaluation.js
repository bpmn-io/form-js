import useService from './useService.js';

/**
 *
 * @param {string | undefined} expression
 * @param {import('../../types').Data} data
 */
export function useEvaluation(expression, data) {
  const initialData = useService('form')._getState().initialData;
  const conditionChecker = useService('conditionChecker', false);

  if (!conditionChecker) {
    return null;
  }

  // make sure we do not use data from hidden fields
  const filteredData = {
    ...initialData,
    ...conditionChecker.applyConditions(data, data)
  };

  return conditionChecker.evaluate(expression, filteredData);
}
