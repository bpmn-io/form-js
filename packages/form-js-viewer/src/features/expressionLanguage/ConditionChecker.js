import { unaryTest } from 'feelin';
import { get, isString, set, values, isObject } from 'min-dash';
import { clone } from '../../util';

/**
 * @typedef {object} Condition
 * @property {string} [hide]
 */

export default class ConditionChecker {
  constructor(formFieldRegistry, pathRegistry, eventBus) {
    this._formFieldRegistry = formFieldRegistry;
    this._pathRegistry = pathRegistry;
    this._eventBus = eventBus;
  }

  /**
   * For given data, remove properties based on condition.
   *
   * @param {Object<string, any>} properties
   * @param {Object<string, any>} data
   * @param {Object} [options]
   * @param {Function} [options.getFilterPath]
   */
  applyConditions(properties, data = {}, options = {}) {

    const newProperties = clone(properties);

    const {
      getFilterPath = (field) => this._pathRegistry.getValuePath(field)
    } = options;

    const form = this._formFieldRegistry.getForm();

    if (!form) {
      throw new Error('form field registry has no form');
    }

    this._pathRegistry.executeRecursivelyOnFields(form, ({ field, isClosed, isRepeatable, context }) => {
      const { conditional: condition } = field;

      context.isHidden = context.isHidden || (condition && this._checkHideCondition(condition, data));

      // if a field is a leaf node (or repeatable, as they behave similarly), and hidden, we need to clear the value from the data from each index
      if (context.isHidden && (isClosed || isRepeatable)) {
        this._clearObjectValueRecursively(getFilterPath(field), newProperties);
      }
    });

    return newProperties;
  }

  /**
   * Check if given condition is met. Returns null for invalid/missing conditions.
   *
   * @param {string} condition
   * @param {import('../../types').Data} [data]
   *
   * @returns {boolean|null}
   */
  check(condition, data = {}) {
    if (!condition) {
      return null;
    }

    if (!isString(condition) || !condition.startsWith('=')) {
      return null;
    }

    try {

      // cut off initial '='
      const result = unaryTest(condition.slice(1), data);

      return result;
    } catch (error) {
      this._eventBus.fire('error', { error });
      return null;
    }
  }

  /**
   * Check if hide condition is met.
   *
   * @param {Condition} condition
   * @param {Object<string, any>} data
   * @returns {boolean}
   */
  _checkHideCondition(condition, data) {
    if (!condition.hide) {
      return false;
    }

    const result = this.check(condition.hide, data);

    return result === true;
  }

  _clearObjectValueRecursively(valuePath, obj) {
    const workingValuePath = [ ...valuePath ];
    let recurse = false;

    do {
      set(obj, workingValuePath, undefined);
      workingValuePath.pop();
      const parentObject = get(obj, workingValuePath);
      recurse = isObject(parentObject) && !values(parentObject).length && !!workingValuePath.length;
    } while (recurse);
  }
}

ConditionChecker.$inject = [
  'formFieldRegistry',
  'pathRegistry',
  'eventBus'
];
