import { isNil, get, set } from 'min-dash';
import { countDecimals } from '../render/components/util/numberFieldUtil';
import { runExpressionEvaluation } from '../util/expressions';
import Big from 'big.js';

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PHONE_PATTERN =
  /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/;

const VALIDATE_FEEL_PROPERTIES = ['min', 'max', 'minLength', 'maxLength'];

export class Validator {
  constructor(expressionLanguage, conditionChecker, form, formFieldRegistry) {
    this._expressionLanguage = expressionLanguage;
    this._conditionChecker = conditionChecker;
    this._form = form;
    this._formFieldRegistry = formFieldRegistry;
  }

  /**
   * Validate against a field definition, does not support proper expression evaluation.
   *
   * @deprecated use validateFieldInstance instead
   */
  validateField(field, value) {
    const { type, validate } = field;

    let errors = [];

    if (type === 'number') {
      errors = [...errors, ...runNumberValidation(field, value)];
    }

    if (!validate) {
      return errors;
    }

    const evaluatedValidation = oldEvaluateFEELValues(
      validate,
      this._expressionLanguage,
      this._conditionChecker,
      this._form,
    );

    errors = [...errors, ...runPresetValidation(field, evaluatedValidation, value)];

    return errors;
  }

  /**
   * Validate a field instance.
   *
   * @param {Object} fieldInstance
   * @param {string} value
   *
   * @returns {Array<string>}
   */
  validateFieldInstance(fieldInstance, value) {
    const { id, expressionContextInfo } = fieldInstance;

    const field = this._formFieldRegistry.get(id);

    if (!field) {
      return [];
    }

    const { type, validate } = field;

    let errors = [];

    if (type === 'number') {
      errors = [...errors, ...runNumberValidation(field, value)];
    }

    if (!validate) {
      return errors;
    }

    const evaluatedValidation = evaluateFEELValues(validate, this._expressionLanguage, expressionContextInfo);

    errors = [...errors, ...runPresetValidation(field, evaluatedValidation, value)];

    const evaluateExpression = (expression) =>
      runExpressionEvaluation(this._expressionLanguage, expression, { ...expressionContextInfo, value });

    if ('custom' in evaluatedValidation && value && evaluatedValidation.custom.length) {
      const { custom } = evaluatedValidation;
      custom.forEach(({ condition, message }) => {
        if (condition && message && !evaluateExpression(condition)) {
          errors = [...errors, evaluateExpression(message)];
        }
      });
    }

    return errors;
  }
}

Validator.$inject = ['expressionLanguage', 'conditionChecker', 'form', 'formFieldRegistry'];

// helpers //////////

function runNumberValidation(field, value) {
  const { decimalDigits, increment } = field;
  const errors = [];

  if (value === 'NaN') {
    errors.push('Value is not a number.');
  } else if (value) {
    if (decimalDigits >= 0 && countDecimals(value) > decimalDigits) {
      errors.push(
        'Value is expected to ' +
          (decimalDigits === 0
            ? 'be an integer'
            : `have at most ${decimalDigits} decimal digit${decimalDigits > 1 ? 's' : ''}`) +
          '.',
      );
    }

    if (increment) {
      const bigValue = Big(value);
      const bigIncrement = Big(increment);

      const offset = bigValue.mod(bigIncrement);

      if (offset.cmp(0) !== 0) {
        const previousValue = bigValue.minus(offset);
        const nextValue = previousValue.plus(bigIncrement);

        errors.push(`Please select a valid value, the two nearest valid values are ${previousValue} and ${nextValue}.`);
      }
    }
  }

  return errors;
}

function runPresetValidation(field, validation, value) {
  const errors = [];

  if (validation.pattern && value && !new RegExp(validation.pattern).test(value)) {
    errors.push(`Field must match pattern ${validation.pattern}.`);
  }

  if (validation.required) {
    const isUncheckedCheckbox = field.type === 'checkbox' && value === false;
    const isUnsetValue = isNil(value) || value === '';
    const isEmptyMultiselect = Array.isArray(value) && value.length === 0;

    if (isUncheckedCheckbox || isUnsetValue || isEmptyMultiselect) {
      errors.push('Field is required.');
    }
  }

  if ('min' in validation && (value || value === 0) && value < validation.min) {
    errors.push(`Field must have minimum value of ${validation.min}.`);
  }

  if ('max' in validation && (value || value === 0) && value > validation.max) {
    errors.push(`Field must have maximum value of ${validation.max}.`);
  }

  if ('minLength' in validation && value && value.trim().length < validation.minLength) {
    errors.push(`Field must have minimum length of ${validation.minLength}.`);
  }

  if ('maxLength' in validation && value && value.trim().length > validation.maxLength) {
    errors.push(`Field must have maximum length of ${validation.maxLength}.`);
  }

  if ('validationType' in validation && value && validation.validationType === 'phone' && !PHONE_PATTERN.test(value)) {
    errors.push('Field must be a valid  international phone number. (e.g. +4930664040900)');
  }

  if ('validationType' in validation && value && validation.validationType === 'email' && !EMAIL_PATTERN.test(value)) {
    errors.push('Field must be a valid email.');
  }

  return errors;
}

function evaluateFEELValues(validate, expressionLanguage, expressionContextInfo) {
  const evaluatedValidate = { ...validate };

  VALIDATE_FEEL_PROPERTIES.forEach((property) => {
    const path = property.split('.');
    const value = get(evaluatedValidate, path);
    const evaluatedValue = runExpressionEvaluation(expressionLanguage, value, expressionContextInfo);
    set(evaluatedValidate, path, evaluatedValue === null ? undefined : evaluatedValue);
  });

  return evaluatedValidate;
}

function oldEvaluateFEELValues(validate, expressionLanguage, conditionChecker, form) {
  const evaluatedValidate = { ...validate };

  VALIDATE_FEEL_PROPERTIES.forEach((property) => {
    const path = property.split('.');

    const value = get(evaluatedValidate, path);

    // mirroring FEEL evaluation of our hooks
    if (!expressionLanguage || !expressionLanguage.isExpression(value)) {
      return value;
    }

    const { initialData, data } = form._getState();

    const newData = conditionChecker ? conditionChecker.applyConditions(data, data) : data;
    const filteredData = { ...initialData, ...newData };

    const evaluatedValue = expressionLanguage.evaluate(value, filteredData);

    // replace validate property with evaluated value
    if (evaluatedValue) {
      set(evaluatedValidate, path, evaluatedValue);
    }
  });

  return evaluatedValidate;
}
