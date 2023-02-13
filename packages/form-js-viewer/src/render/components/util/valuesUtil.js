import { get } from 'min-dash';

// parses the options data from the provided form field and form data
export function getValuesData(formField, formData) {
  const { valuesKey, values } = formField;
  return valuesKey ? get(formData, [ valuesKey ]) : values;
}

// transforms the provided options into a normalized format, trimming invalid options
export function normalizeValuesData(valuesData) {
  return valuesData.filter(_isValueSomething).map(v => _normalizeValueData(v)).filter(v => v);
}

function _normalizeValueData(valueData) {

  if (_isAllowedValue(valueData)) {

    // if a primitive is provided, use it as label and value
    return { value: valueData, label: `${ valueData }` };
  }

  if (typeof (valueData) === 'object') {
    if (!valueData.label && _isAllowedValue(valueData.value)) {

      // if no label is provided, use the value as label
      return { value: valueData.value, label: `${ valueData.value }` };
    }

    if (_isValueSomething(valueData.value) && _isAllowedValue(valueData.label)) {

      // if both value and label are provided, use them as is, in this scenario, the value may also be an object
      return valueData;
    }
  }

  return null;
}

function _isAllowedValue(value) {
  return _isReadableType(value) && _isValueSomething(value);
}

function _isReadableType(value) {
  return [ 'number', 'string', 'boolean' ].includes(typeof(value));
}

function _isValueSomething(value) {
  return value || value === 0 || value === false;
}