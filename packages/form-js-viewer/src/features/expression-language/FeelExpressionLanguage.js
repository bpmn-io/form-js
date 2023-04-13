import { evaluate } from 'feelin';
import { isString } from 'min-dash';
import { getFlavouredFeelVariableNames } from './variableExtractionHelpers';

export default class FeelExpressionLanguage {
  constructor(eventBus) {
    this._eventBus = eventBus;
  }

  /**
   * Determines if the given value is a FEEL expression.
   *
   * @param {any} value
   * @returns {boolean}
   *
   */
  isExpression(value) { return isString(value) && value.startsWith('='); }

  /**
   * Retrieve variable names from a given FEEL expression.
   *
   * @param {string} expression
   * @param {object} [options]
   * @param {string} [options.type]
   *
   * @returns {string[]}
   */
  getVariableNames(expression, options = {}) {

    const {
      type = 'expression'
    } = options;

    if (!this.isExpression(expression)) {
      return [];
    }

    if (![ 'unaryTest', 'expression' ].includes(type)) {
      throw new Error('Unknown expression type: ' + type);
    }

    return getFlavouredFeelVariableNames(expression, type);
  }

  /**
   * Evaluate an expression.
   *
   * @param {string} expression
   * @param {import('../../types').Data} [data]
   *
   * @returns {any}
   */
  evaluate(expression, data = {}) {
    if (!expression) {
      return null;
    }

    if (!isString(expression) || !expression.startsWith('=')) {
      return null;
    }

    try {
      const result = evaluate(expression.slice(1), data);

      return result;
    } catch (error) {
      this._eventBus.fire('error', { error });
      return null;
    }
  }
}

FeelExpressionLanguage.$inject = [
  'eventBus'
];