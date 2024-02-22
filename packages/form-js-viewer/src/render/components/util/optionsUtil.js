import { get, isObject, isString, isNil } from 'min-dash';

// parses the options data from the provided form field and form data
export function getOptionsData(formField, formData) {
  const { valuesKey: optionsKey, values: staticOptions } = formField;
  return optionsKey ? get(formData, [optionsKey]) : staticOptions;
}

// transforms the provided options into a normalized format, trimming invalid options
export function normalizeOptionsData(optionsData) {
  return optionsData
    .filter(_isAllowedValue)
    .map(_normalizeOption)
    .filter((o) => !isNil(o));
}

/**
 * Converts the provided option to a normalized format.
 * If the option is not valid, null is returned.
 *
 * @param {object} option
 * @param {string} option.label
 * @param {*} option.value
 *
 * @returns
 */
function _normalizeOption(option) {
  // (1) simple primitive case, use it as both label and value
  if (_isAllowedPrimitive(option)) {
    return { value: option, label: `${option}` };
  }

  if (isObject(option)) {
    const isValidLabel = _isValidLabel(option.label);

    // (2) no label provided, but value is a simple primitive, use it as label and value
    if (!isValidLabel && _isAllowedPrimitive(option.value)) {
      return { value: option.value, label: `${option.value}` };
    }

    // (3) both label and value are provided, use them as is
    if (isValidLabel && _isAllowedValue(option.value)) {
      return option;
    }
  }

  return null;
}

function _isAllowedPrimitive(value) {
  const isAllowedPrimitiveType = ['number', 'string', 'boolean'].includes(typeof value);
  const isValid = value || value === 0 || value === false;

  return isAllowedPrimitiveType && isValid;
}

function _isValidLabel(label) {
  return label && isString(label);
}

function _isAllowedValue(value) {
  if (isObject(value)) {
    return Object.keys(value).length > 0;
  }

  return _isAllowedPrimitive(value);
}

export function createEmptyOptions(options = {}) {
  const defaults = {};

  // provide default options if valuesKey and valuesExpression are not set
  if (!options.valuesKey && !options.valuesExpression) {
    defaults.values = [
      {
        label: 'Value',
        value: 'value',
      },
    ];
  }

  return {
    ...defaults,
    ...options,
  };
}
