import { evaluate as evaluateFeelers } from 'feelers';
import { isString } from 'min-dash';

export default class FeelersTemplating {

  constructor() { }

  isTemplate(value) { return isString(value) && (value.startsWith('=') || /{{/.test(value)); }

  /**
   * Evaluate a template.
   *
   * @param {string} template
   * @param {Object<string, any>} context
   * @param {Object} options
   * @param {boolean} [options.debug = false]
   * @param {boolean} [options.strict = false]
   * @param {Function} [options.buildDebugString]
   *
   * @returns
   */
  evaluate(template, context = {}, options = {}) {

    const {
      debug = false,
      strict = false,
      buildDebugString = (err) => ' {{⚠}} '
    } = options;

    return evaluateFeelers(template, context, { debug, strict, buildDebugString });
  }
}

FeelersTemplating.$inject = [];