import { unaryTest } from 'feelin';
import { isString } from 'min-dash';

/**
 * @typedef {object} Condition
 * @property {string} [hide]
 */

export default class ConditionChecker {
  constructor(formFieldRegistry, eventBus) {
    this._formFieldRegistry = formFieldRegistry;
    this._eventBus = eventBus;
  }

  /**
   * For given data, remove properties based on condition.
   *
   * @param {Object<string, any>} properties
   * @param {Object<string, any>} data
   */
  applyConditions(properties, data = {}) {

    const conditions = this._getConditions();

    const newProperties = { ...properties };

    for (const { key, condition } of conditions) {
      const shouldRemove = this._checkHideCondition(condition, data);

      if (shouldRemove) {
        delete newProperties[ key ];
      }
    }

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

  _getConditions() {
    const formFields = this._formFieldRegistry.getAll();

    return formFields.reduce((conditions, formField) => {
      const { key, conditional: condition } = formField;

      if (key && condition) {
        return [ ...conditions, { key, condition } ];
      }

      return conditions;

    }, []);
  }
}

ConditionChecker.$inject = [
  'formFieldRegistry',
  'eventBus'
];
