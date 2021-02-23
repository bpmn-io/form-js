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

    if (validate.required && typeof value === 'undefined') {
      errors = [
        ...errors,
        'Field is required.'
      ];
    }

    if ('minLength' in validate && value && value.trim().length < validate.minLength) {
      errors = [
        ...errors,
        `Field must have minimum length of ${ validate.minLength }`
      ];
    }

    return errors;
  }
}