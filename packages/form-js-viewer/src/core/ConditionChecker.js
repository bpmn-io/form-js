import { unaryTest, evaluate } from 'feelin';
import { isString } from 'min-dash';

export class ConditionChecker {
  constructor(formFieldRegistry) {
    this._formFieldRegistry = formFieldRegistry;
  }

  /**
   * For given data, remove properties for which conditions are not met.
   *
   * @param {Object<string, any>} properties
   * @param {Object<string, any>} data
   */
  applyConditions(properties, data = {}) {
    const conditions = this._getConditions();

    const newProperties = { ...properties };
    for (const { key, condition } of conditions) {
      const shouldRemove = !this.check(condition, data);

      if (shouldRemove) {
        delete newProperties[ key ];
      }
    }

    return newProperties;
  }

  /**
   * Check if given condition is met.
   *
   * @param {string} condition
   * @param {import('../types').Data} [data]
   * @param {boolean} [defaultValue]
   *
   * @returns {boolean}
   */
  check(condition, data = {}, defaultValue) {
    if (!condition) {
      return defaultValue;
    }

    if (!isString(condition) || !condition.startsWith('=')) {
      return false;
    }

    try {
      const result = unaryTest(condition.slice(1), data);

      return result;
    } catch (error) {
      return false;
    }
  }

  evaluate(condition, data = {}, defaultValue) {
    if (!condition) {
      return defaultValue;
    }

    if (!isString(condition) || !condition.startsWith('=')) {
      return false;
    }

    try {
      const result = evaluate(condition.slice(1), data);

      return result;
    } catch (error) {
      return false;
    }
  }

  _getConditions() {
    const formFields = this._formFieldRegistry.getAll();

    const conditions = [];
    for (const field of formFields) {
      const { key, condition } = field;

      if (!condition || !key) {
        continue;
      }

      conditions.push({
        key,
        condition
      });
    }

    return conditions;
  }
}

ConditionChecker.$inject = [
  'formFieldRegistry'
];
