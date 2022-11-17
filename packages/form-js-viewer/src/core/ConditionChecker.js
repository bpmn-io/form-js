import { unaryTest } from 'feelin';
import { isString } from 'min-dash';

export class ConditionChecker {
  constructor(formFieldRegistry, eventBus) {
    this._formFieldRegistry = formFieldRegistry;
    this._eventBus = eventBus;
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
   *
   * @returns {boolean}
   */
  check(condition, data = {}) {
    if (!condition) {
      return true;
    }

    if (!isString(condition) || !condition.startsWith('=')) {
      return false;
    }

    try {

      // cut off initial '='
      const result = unaryTest(condition.slice(1), data);

      return result;
    } catch (error) {
      this._eventBus.fire('error', { error });
      return false;
    }
  }

  _getConditions() {
    const formFields = this._formFieldRegistry.getAll();

    return formFields.reduce((conditions, formField) => {
      const { key, condition } = formField;

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
