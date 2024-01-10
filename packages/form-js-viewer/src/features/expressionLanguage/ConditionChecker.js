import { unaryTest } from 'feelin';
import { get, isString, set, values, isObject } from 'min-dash';
import { buildExpressionContext, clone } from '../../util';

/**
 * @typedef {object} Condition
 * @property {string} [hide]
 */

export class ConditionChecker {
  constructor(formFieldRegistry, pathRegistry, eventBus) {
    this._formFieldRegistry = formFieldRegistry;
    this._pathRegistry = pathRegistry;
    this._eventBus = eventBus;
  }

  /**
   * For given data, remove properties based on condition.
   *
   * @param {Object<string, any>} data
   * @param {Object<string, any>} contextData
   * @param {Object} [options]
   * @param {Function} [options.getFilterPath]
   * @param {boolean} [options.leafNodeDeletionOnly]
   */
  applyConditions(data, contextData = {}, options = {}) {

    const workingData = clone(data);

    const {
      getFilterPath = (field, indexes) => this._pathRegistry.getValuePath(field, { indexes }),
      leafNodeDeletionOnly = false
    } = options;

    const _applyConditionsWithinScope = (rootField, scopeContext, startHidden = false) => {

      const {
        indexes = {},
        expressionIndexes = [],
        scopeData = contextData,
        parentScopeData = null
      } = scopeContext;

      this._pathRegistry.executeRecursivelyOnFields(rootField, ({ field, isClosed, isRepeatable, context }) => {

        const {
          conditional,
          components,
          id
        } = field;

        // build the expression context in the right format
        const localExpressionContext = buildExpressionContext({
          this: scopeData,
          data: contextData,
          i: expressionIndexes,
          parent: parentScopeData
        });

        context.isHidden = startHidden || context.isHidden || (conditional && this._checkHideCondition(conditional, localExpressionContext));

        // if a field is repeatable and visible, we need to implement custom recursion on its children
        if (isRepeatable && (!context.isHidden || leafNodeDeletionOnly)) {

          // prevent the regular recursion behavior of executeRecursivelyOnFields
          context.preventRecursion = true;

          const repeaterValuePath = this._pathRegistry.getValuePath(field, { indexes });
          const repeaterValue = get(contextData, repeaterValuePath);

          // quit early if there are no children or data associated with the repeater
          if (!Array.isArray(repeaterValue) || !repeaterValue.length || !Array.isArray(components) || !components.length) {
            return;
          }

          for (let i = 0; i < repeaterValue.length; i++) {

            // create a new scope context for each index
            const newScopeContext = {
              indexes: { ...indexes, [id]: i },
              expressionIndexes: [ ...expressionIndexes, i + 1 ],
              scopeData: repeaterValue[i],
              parentScopeData: scopeData
            };

            // for each child component, apply conditions within the new repetition scope
            components.forEach(component => {
              _applyConditionsWithinScope(component, newScopeContext, context.isHidden);
            });

          }

        }

        // if we have a hidden repeatable field, and the data structure allows, we clear it directly at the root and stop recursion
        if (context.isHidden && !leafNodeDeletionOnly && isRepeatable) {
          context.preventRecursion = true;
          this._cleanlyClearDataAtPath(getFilterPath(field, indexes), workingData);
        }

        // for simple leaf fields, we always clear
        if (context.isHidden && isClosed) {
          this._cleanlyClearDataAtPath(getFilterPath(field, indexes), workingData);
        }

      });

    };

    // apply conditions starting with the root of the form
    const form = this._formFieldRegistry.getForm();

    if (!form) {
      throw new Error('form field registry has no form');
    }

    _applyConditionsWithinScope(form, {
      scopeData: contextData
    });

    return workingData;
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

  _cleanlyClearDataAtPath(valuePath, obj) {
    const workingValuePath = [ ...valuePath ];
    let recurse = false;

    do {
      set(obj, workingValuePath, undefined);
      workingValuePath.pop();
      const parentObject = get(obj, workingValuePath);
      recurse = !!workingValuePath.length && (this._isEmptyObject(parentObject) || this._isEmptyArray(parentObject));
    } while (recurse);
  }

  _isEmptyObject(parentObject) {
    return isObject(parentObject) && !values(parentObject).length;
  }

  _isEmptyArray(parentObject) {
    return Array.isArray(parentObject) && (!parentObject.length || parentObject.every(item => item === undefined));
  }
}

ConditionChecker.$inject = [
  'formFieldRegistry',
  'pathRegistry',
  'eventBus'
];
