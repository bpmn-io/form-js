import { useService } from './useService.js';
import { useMemo } from 'preact/hooks';

/**
 * Returns the conditionally filtered data of a form reactively.
 * Memoised to minimize re-renders
 *
 * Warning: costly operation, use with care
 */
export function useFilteredFormData() {
  const { initialData, data } = useService('form')._getState();
  const conditionChecker = useService('conditionChecker', false);

  return useMemo(() => {
    const newData = conditionChecker ? conditionChecker.applyConditions(data, data) : data;
    return { ...initialData, ...newData };
  }, [ conditionChecker, data, initialData ]);

}
