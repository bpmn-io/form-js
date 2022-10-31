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

    if ('enforceStep' in validate && value && field.step) {

      let inaccuracy = (value + field.step) % field.step;
      inaccuracy = Math.min(inaccuracy, field.step - inaccuracy);

      const decimalDigits = field.decimalDigits || 15;

      if (2 * Number.EPSILON < inaccuracy) {

        const previousValue = value - (value % field.step);
        const followingValue = previousValue + field.step;

        errors = [
          ...errors,
          `Please select a valid value, the two nearest valid values are ${parseFloat(previousValue.toFixed(decimalDigits))} and ${parseFloat(followingValue.toFixed(decimalDigits))}.`
        ];

      }
    }

    return errors;
  }
}

Validator.$inject = [];
