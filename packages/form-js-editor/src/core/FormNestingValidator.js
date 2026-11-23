const ROOT_TYPE = 'default';

/**
 * Checks where a field may be placed, based on the `allowedParents` and
 * `allowedChildren` a form field declares on its config. Both are optional
 * lists of field types; a field without them may be placed anywhere and may
 * hold anything.
 */
export class FormNestingValidator {
  /**
   * @constructor
   *
   * @param { import('@bpmn-io/form-js-viewer').FormFields } formFields
   */
  constructor(formFields) {
    this._formFields = formFields;
  }

  /**
   * Report why a field of the given type may not be placed inside a parent of the
   * given type, or nothing if the placement is fine.
   *
   * @param {string} type
   * @param {string} parentType
   * @returns {string|undefined}
   */
  validate(type, parentType) {
    const { allowedParents } = this._getConfig(type);

    if (Array.isArray(allowedParents) && !allowedParents.includes(parentType)) {
      return `${this._getName(type)} can only be placed in: ${this._getNames(allowedParents)}`;
    }

    const { allowedChildren } = this._getConfig(parentType);

    if (Array.isArray(allowedChildren) && !allowedChildren.includes(type)) {
      return `${this._getName(parentType)} can only hold: ${this._getNames(allowedChildren)}`;
    }
  }

  _getConfig(type) {
    const formField = type && this._formFields.get(type);

    return (formField && formField.config) || {};
  }

  _getName(type) {
    if (type === ROOT_TYPE) {
      return 'the form';
    }

    return this._getConfig(type).name || type;
  }

  _getNames(types) {
    return types.map((type) => this._getName(type)).join(', ');
  }
}

FormNestingValidator.$inject = ['formFields'];
