import { unaryTest } from 'feelin';

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
   * @param {{ expression: string }} condition
   * @param {import('../types').Data} data
   *
   * @returns {boolean}
   */
  check(condition, data) {
    if (!condition || !condition.expression) {
      return true;
    }

    const { expression } = condition;

    if (!expression.startsWith('=')) {
      return false;
    }

    return unaryTest(expression.slice(1), data);
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
