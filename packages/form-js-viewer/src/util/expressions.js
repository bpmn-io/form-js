import { get } from 'min-dash';
import { wrapObjectKeysWithUnderscores } from './simple';

/**
 * Builds an expression context object based on the expression context information.
 *
 * @param {Object} expressionContextInfo - The expression context information.
 * @param {Object} options - The options to use.
 * @param {Object} [ options.overrideData ] - The override data to use.
 * @returns {Object} The expression context object.
 */
export function buildExpressionContext(expressionContextInfo, options = {}) {
  const rootData = options.overrideData || expressionContextInfo.data;
  const segments = expressionContextInfo.segments || [];

  let workingContext = wrapExpressionContext({
    data: rootData,
    this: rootData,
    parent: null,
    i: [],
  });

  for (var x = 0; x < segments.length; x++) {
    const segment = segments[x];
    const pathArray = segment.path.split('.');

    const currentData = get(workingContext.data, pathArray);
    const indexedData = segment.index !== undefined ? currentData[segment.index] : currentData;

    workingContext = wrapExpressionContext({
      data: rootData,
      this: indexedData,
      parent: workingContext,
      i: [...workingContext.i, segment.index + 1],
    });
  }

  return workingContext;
}

/**
 * Wraps an expresson context object into a usable FEEL context.
 *
 * @param {Object} context - The ExpressionContext object.
 * @returns {Object} The usable FEEL context.
 */

export function wrapExpressionContext(context) {
  const { data, ...specialContextKeys } = context;

  return {
    ...specialContextKeys,
    ...data,
    ...wrapObjectKeysWithUnderscores(specialContextKeys),
  };
}

/**
 * Evaluate a string based on the expressionLanguage and context information.
 * If the string is not an expression, it is returned as is.
 *
 * @param {any} expressionLanguage - The expression language to use.
 * @param {string} expression - The string expression to evaluate.
 * @param {Object} expressionContextInfo - The context information to use.
 * @returns {any} - Evaluated value or the original value if not an expression.
 */
export function runExpressionEvaluation(expressionLanguage, expression, expressionContextInfo) {
  if (expressionLanguage && expressionLanguage.isExpression(expression)) {
    return expressionLanguage.evaluate(expression, buildExpressionContext(expressionContextInfo));
  }
  return expression;
}
