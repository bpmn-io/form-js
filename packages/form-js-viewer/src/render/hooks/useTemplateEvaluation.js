import { useService } from './useService';
import { useContext, useMemo } from 'preact/hooks';
import { LocalExpressionContext } from '../context/LocalExpressionContext';
import { buildExpressionContext } from '../../util/simple';

/**
 * Template a string reactively based on form data. If the string is not a template, it is returned as is.
 * Memoised to minimize re-renders
 *
 * @param {string} value
 * @param {Object} options
 * @param {boolean} [options.debug = false]
 * @param {boolean} [options.strict = false]
 * @param {Function} [options.sanitizer]
 * @param {Function} [options.buildDebugString]
 *
 */
export function useTemplateEvaluation(value, options = {}) {
  const templating = useService('templating');
  const expressionContextInfo = useContext(LocalExpressionContext);

  return useMemo(() => {
    if (templating && templating.isTemplate(value)) {
      return templating.evaluate(value, buildExpressionContext(expressionContextInfo), options);
    }
    return value;
  }, [ templating, value, expressionContextInfo, options ]);
}
