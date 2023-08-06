import { set } from 'min-dash';
import { clone } from '../../../util';

export default class UpdateFieldValidationHandler {

  constructor(form, validator) {
    this._form = form;
    this._validator = validator;
  }

  execute(context) {
    const { field, value } = context;
    const { errors } = this._form._getState();

    context.oldErrors = clone(errors);

    const fieldErrors = this._validator.validateField(field, value);
    const updatedErrors = set(errors, [ field.id ], fieldErrors.length ? fieldErrors : undefined);
    this._form._setState({ errors: updatedErrors });
  }

  revert(context) {
    this._form._setState({ errors: context.oldErrors });
  }
}

UpdateFieldValidationHandler.$inject = [ 'form', 'validator' ];