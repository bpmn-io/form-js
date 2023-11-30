import { FilteredFormDataContext } from '../context/FilteredFormDataContextProvider';
import useService from './useService';
import { useContext, useMemo } from 'preact/hooks';

/**
 * Template a string reactively based on form data. If the string is not a template, it is returned as is.
 * Memoised to minimize re-renders
 *
 * @param {string} value
 * @param {Object} options
 * @param {boolean} [options.debug = false]
 * @param {boolean} [options.strict = false]
 * @param {Function} [options.buildDebugString]
 *
 */
export default function useTemplateEvaluation(value, options) {
  const filteredData = useContext(FilteredFormDataContext);
  const templating = useService('templating');

  return useMemo(() => {

    if (templating && templating.isTemplate(value)) {
      return templating.evaluate(value, filteredData, options);
    }

    return value;

  }, [ filteredData, templating, value, options ]);
}
