import { isNil } from 'min-dash';

export default class Validator {

  validateField(field, value) {

    const { validate } = field;

    let errors = [];

    if (!validate) {
      return errors;
    }

    if (validate.pattern && value && !new RegExp(validate.pattern).test(value)) {
      errors = [
        ...errors,
        `Field must match pattern ${ validate.pattern }.`
      ];
    }

    if (validate.required && (isNil(value) || value === '')) {
      errors = [
        ...errors,
        'Field is required.'
      ];
    }

    if ('min' in validate && value && value < validate.min) {
      errors = [
        ...errors,
        `Field must have minimum value of ${ validate.min }.`
      ];
    }

    if ('max' in validate && value && value > validate.max) {
      errors = [
        ...errors,
        `Field must have maximum value of ${ validate.max }.`
      ];
    }

    if ('minLength' in validate && value && value.trim().length < validate.minLength) {
      errors = [
        ...errors,
        `Field must have minimum length of ${ validate.minLength }.`
      ];
    }

    if ('maxLength' in validate && value && value.trim().length > validate.maxLength) {
      errors = [
        ...errors,
        `Field must have maximum length of ${ validate.maxLength }.`
      ];
    }

    return errors;
  }
}