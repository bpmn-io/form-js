import { evaluate, parseExpressions, parseUnaryTests } from 'feelin';
import { isString } from 'min-dash';

export default class FeelExpressionLanguage {
  constructor(eventBus) {
    this._eventBus = eventBus;
  }

  /**
   * Determines if the given string is a FEEL expression.
   *
   * @param {string} value
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

    if (type === 'unaryTest') {
      return this._getUnaryVariableNames(expression);
    }
    else if (type === 'expression') {
      return this._getExpressionVariableNames(expression);
    }

    throw new Error('Unknown expression type: ' + options.type);
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

  _getExpressionVariableNames(expression) {
    const tree = parseExpressions(expression);
    const cursor = tree.cursor();

    const variables = new Set();
    do {
      const node = cursor.node;

      if (node.type.name === 'VariableName') {
        variables.add(expression.slice(node.from, node.to));
      }

    } while (cursor.next());

    return Array.from(variables);
  }

  _getUnaryVariableNames(unaryTest) {
    const tree = parseUnaryTests(unaryTest);
    const cursor = tree.cursor();

    const variables = new Set();
    do {
      const node = cursor.node;

      if (node.type.name === 'VariableName') {
        variables.add(unaryTest.slice(node.from, node.to));
      }

    } while (cursor.next());

    return Array.from(variables);
  }
}

FeelExpressionLanguage.$inject = [
  'eventBus'
];