import { useService } from './useService.js';
import { useMemo } from 'preact/hooks';
import { merge } from 'min-dash';
import { clone } from '../../util/simple';

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

    // deep-merge newData over a clone of initialData, so keys pruned from
    // newData (e.g. by a hidden group) fall back to their initial value
    // instead of the whole branch disappearing
    return merge(clone(initialData || {}), newData);
  }, [conditionChecker, data, initialData]);
}
