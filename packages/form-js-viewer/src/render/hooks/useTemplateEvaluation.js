import useService from './useService';
import useFilteredFormData from './useFilteredFormData';
import { useContext, useMemo } from 'preact/hooks';
import LocalExpressionContext from '../context/LocalExpressionContext';
import { wrapExpressionContext } from '../../util/simple';

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
export default function useTemplateEvaluation(value, options = {}) {
  const filteredData = useFilteredFormData();
  const templating = useService('templating');

  const variableContext = useContext(LocalExpressionContext);

  const fullData = useMemo(() => {
    if (variableContext) {
      return wrapExpressionContext(filteredData, variableContext);
    }
    return filteredData;
  }, [ filteredData, variableContext ]);

  return useMemo(() => {
    if (templating && templating.isTemplate(value)) {
      return templating.evaluate(value, fullData, options);
    }
    return value;
  }, [ fullData, templating, value, options ]);
}

