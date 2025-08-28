import { set } from 'min-dash';
import { clone } from '../../../util';

/**
 * @deprecated
 */
export class UpdateFieldValidationHandler {
  constructor(form, validator, translate) {
    this._form = form;
    this._validator = validator;
    this._translate = translate;
  }

  execute(context) {
    const { field, value, indexes } = context;
    const { errors } = this._form._getState();

    context.oldErrors = clone(errors);

    const fieldErrors = this._validator.validateField(field, value, this._translate);
    const updatedErrors = set(
      errors,
      [field.id, ...Object.values(indexes || {})],
      fieldErrors.length ? fieldErrors : undefined,
    );
    this._form._setState({ errors: updatedErrors });
  }

  revert(context) {
    this._form._setState({ errors: context.oldErrors });
  }
}

UpdateFieldValidationHandler.$inject = ['form', 'validator', 'translate'];
