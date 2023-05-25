import useTemplateEvaluation from './useTemplateEvaluation';
import { useMemo } from 'preact/hooks';

/**
 * Template a string reactively based on form data. If the string is not a template, it is returned as is.
 * If the string contains multiple lines, only the first line is returned.
 * Memoised to minimize re-renders
 *
 * @param {string} value
 * @param {Object} [options]
 * @param {boolean} [options.debug = false]
 * @param {boolean} [options.strict = false]
 * @param {Function} [options.buildDebugString]
 *
 */
export default function useSingleLineTemplateEvaluation(value, options = {}) {
  const evaluatedTemplate = useTemplateEvaluation(value, options);
  return useMemo(() => evaluatedTemplate && evaluatedTemplate.split('\n')[0], [ evaluatedTemplate ]);
}