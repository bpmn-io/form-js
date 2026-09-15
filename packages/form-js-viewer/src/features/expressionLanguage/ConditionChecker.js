import { get, set, values, isObject } from 'min-dash';
import { buildExpressionContext, clone } from '../../util';

/**
 * @typedef { import('../../types').ExpressionLanguage } ExpressionLanguage
 */

/**
 * @typedef {object} Condition
 * @property {string} [hide]
 */

export class ConditionChecker {
  /**
   * @param {Object} formFieldRegistry
   * @param {Object} pathRegistry
   * @param {ExpressionLanguage} expressionLanguage
   * @param {Object} eventBus
   * @param {Object} formFields
   */
  constructor(formFieldRegistry, pathRegistry, expressionLanguage, eventBus, formFields) {
    this._formFieldRegistry = formFieldRegistry;
    this._pathRegistry = pathRegistry;
    this._expressionLanguage = expressionLanguage;
    this._eventBus = eventBus;
    this._formFields = formFields;
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

    const { getFilterPath = (field, indexes) => this._pathRegistry.getValuePath(field, { indexes }) } = options;

    this._walkConditions(contextData, ({ field, indexes, isHidden, isClosed, isRepeatable }) => {
      // a repeater is cleared at its root, a leaf field at its own path; a
      // container holds no data of its own and is cleared through its children
      if (!isHidden || !(isClosed || isRepeatable)) {
        return;
      }

      this._eventBus.fire('conditionChecker.remove', {
        item: { [field.key]: get(workingData, getFilterPath(field, indexes)) },
      });

      this._cleanlyClearDataAtPath(getFilterPath(field, indexes), workingData);
    });

    return workingData;
  }

  /**
   * Report the ids of the fields hidden by condition within a given repetition.
   *
   * Pass the unfiltered data. A field that hides itself through a field it
   * contains would otherwise reappear once its own value is cleared.
   *
   * @param {Object<string, any>} contextData
   * @param {Object<string, number>} [indexes] - repetition indexes to report for, keyed by repeater id
   * @returns {Set<string>}
   */
  getHiddenFieldIds(contextData = {}, indexes = {}) {
    const hiddenFieldIds = new Set();

    this._walkConditions(contextData, ({ field, indexes: fieldIndexes, isHidden }) => {
      if (!isHidden) {
        return;
      }

      const isSameRepetition = Object.entries(indexes).every(([id, index]) => fieldIndexes[id] === index);

      if (isSameRepetition) {
        hiddenFieldIds.add(field.id);
      }
    });

    return hiddenFieldIds;
  }

  /**
   * Walk every field of the form, resolving its hide condition and passing the
   * verdict on to the caller.
   *
   * Containers take part in the walk even when they hold no data of their own,
   * so that a condition on a container reaches the fields underneath it.
   *
   * @param {Object<string, any>} contextData
   * @param {(result: { field: Object, indexes: Object<string, number>, isHidden: boolean, isClosed: boolean, isRepeatable: boolean }) => void} visit
   */
  _walkConditions(contextData, visit) {
    const walkScope = (rootField, scopeContext, startHidden = false) => {
      const { indexes = {}, expressionIndexes = [], scopeData = contextData, parentScopeData = null } = scopeContext;

      const walkField = (field, hiddenByAncestor) => {
        const { conditional, components, id } = field;
        const { config } = this._formFields.get(field.type);

        const isClosed = Boolean(config.keyed);
        const isRepeatable = Boolean(config.repeatable);

        // build the expression context in the right format
        const localExpressionContext = buildExpressionContext({
          this: scopeData,
          data: contextData,
          i: expressionIndexes,
          parent: parentScopeData,
        });

        const isHidden = Boolean(
          hiddenByAncestor || (conditional && this._checkHideCondition(conditional, localExpressionContext)),
        );

        visit({ field, indexes, isHidden, isClosed, isRepeatable });

        // a hidden repeater is handled at its root, a leaf field has nothing below it
        if (isClosed || (isRepeatable && isHidden)) {
          return;
        }

        if (!Array.isArray(components) || !components.length) {
          return;
        }

        if (!isRepeatable) {
          components.forEach((component) => walkField(component, isHidden));
          return;
        }

        // a visible repeater scopes its children to each repetition
        const repeaterValue = get(contextData, this._pathRegistry.getValuePath(field, { indexes }));

        if (!Array.isArray(repeaterValue)) {
          return;
        }

        repeaterValue.forEach((itemValue, index) => {
          components.forEach((component) =>
            walkScope(
              component,
              {
                indexes: { ...indexes, [id]: index },
                expressionIndexes: [...expressionIndexes, index + 1],
                scopeData: itemValue,
                parentScopeData: scopeData,
              },
              isHidden,
            ),
          );
        });
      };

      walkField(rootField, startHidden);
    };

    // resolve conditions starting with the root of the form
    const form = this._formFieldRegistry.getForm();

    if (!form) {
      throw new Error('form field registry has no form');
    }

    walkScope(form, {
      scopeData: contextData,
    });
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
    return this._expressionLanguage.evaluateUnaryTest(condition, data);
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
    const workingValuePath = [...valuePath];
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
    return Array.isArray(parentObject) && (!parentObject.length || parentObject.every((item) => item === undefined));
  }
}

ConditionChecker.$inject = ['formFieldRegistry', 'pathRegistry', 'expressionLanguage', 'eventBus', 'formFields'];
