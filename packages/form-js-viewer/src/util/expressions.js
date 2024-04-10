import { wrapObjectKeysWithUnderscores } from './simple';

/**
 * Transform a LocalExpressionContext object into a usable FEEL context.
 *
 * @param {Object} context - The LocalExpressionContext object.
 * @returns {Object} The usable FEEL context.
 */

export function buildExpressionContext(context) {
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
