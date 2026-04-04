import { set } from 'min-dash';
import { clone, deleteAt } from '../../../util';

export class UpdateFieldInstanceValidationHandler {
  constructor(form, validator) {
    this._form = form;
    this._validator = validator;
  }

  execute(context) {
    const { fieldInstance, value } = context;
    const { id, indexes } = fieldInstance;
    const { errors } = this._form._getState();

    context.oldErrors = clone(errors);

    const fieldErrors = this._validator.validateFieldInstance(fieldInstance, value);
    const errorPath = [id, ...Object.values(indexes || {})];

    if (fieldErrors.length) {
      set(errors, errorPath, fieldErrors);
    } else {
      deleteAt(errors, errorPath);
    }

    this._form._setState({ errors });
  }

  revert(context) {
    this._form._setState({ errors: context.oldErrors });
  }
}

UpdateFieldInstanceValidationHandler.$inject = ['form', 'validator'];
