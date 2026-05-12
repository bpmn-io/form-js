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
 * If the value is a valid expression, it is evaluated and returned. Otherwise, it is returned as-is.
 *
 * @param {import('../types').ExpressionLanguage} expressionLanguage - The expression language to use.
 * @param {any} value - The static value or expression to evaluate.
 * @param {Object} expressionContextInfo - The context information to use.
 * @returns {any} - Evaluated value or the original value if not an expression.
 */
export function runExpressionEvaluation(expressionLanguage, value, expressionContextInfo) {
  if (expressionLanguage.isExpression(value)) {
    return expressionLanguage.evaluate(value, buildExpressionContext(expressionContextInfo));
  }
  return value;
}

/**
 * Evaluate a value as a unary test expression. Returns null for invalid/missing expressions or
 * if the expression language is not available.
 *
 * @param {import('../types').ExpressionLanguage} expressionLanguage - The expression language to use.
 * @param {string} value - The unary test expression to evaluate.
 * @param {Object} expressionContextInfo - The context information to use.
 * @returns {boolean | null} - Evaluated result, or null if expression is invalid/missing.
 */
export function runUnaryTestEvaluation(expressionLanguage, value, expressionContextInfo) {
  return expressionLanguage.evaluateUnaryTest(value, buildExpressionContext(expressionContextInfo));
}
