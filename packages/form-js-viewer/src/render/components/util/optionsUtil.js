import { get } from 'min-dash';

// parses the options data from the provided form field and form data
export function getOptionsData(formField, formData) {
  const { valuesKey: optionsKey, values: staticOptions } = formField;
  return optionsKey ? get(formData, [ optionsKey ]) : staticOptions;
}

// transforms the provided options into a normalized format, trimming invalid options
export function normalizeOptionsData(optionsData) {
  return optionsData.filter(_isOptionSomething).map(v => _normalizeOptionsData(v)).filter(v => v);
}

function _normalizeOptionsData(optionData) {

  if (_isAllowedOption(optionData)) {

    // if a primitive is provided, use it as label and value
    return { value: optionData, label: `${ optionData }` };
  }

  if (typeof (optionData) === 'object') {
    if (!optionData.label && _isAllowedOption(optionData.value)) {

      // if no label is provided, use the value as label
      return { value: optionData.value, label: `${ optionData.value }` };
    }

    if (_isOptionSomething(optionData.value) && _isAllowedOption(optionData.label)) {

      // if both value and label are provided, use them as is, in this scenario, the value may also be an object
      return optionData;
    }
  }

  return null;
}

function _isAllowedOption(option) {
  return _isReadableType(option) && _isOptionSomething(option);
}

function _isReadableType(option) {
  return [ 'number', 'string', 'boolean' ].includes(typeof(option));
}

function _isOptionSomething(option) {
  return option || option === 0 || option === false;
}

export function createEmptyOptions(options = {}) {

  const defaults = {};

  // provide default options if valuesKey and valuesExpression are not set
  if (!options.valuesKey && !options.valuesExpression) {
    defaults.values = [
      {
        label: 'Value',
        value: 'value'
      }
    ];
  }

  return {
    ...defaults,
    ...options
  };
}