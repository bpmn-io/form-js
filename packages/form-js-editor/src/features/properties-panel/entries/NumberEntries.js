import { NumberFieldEntry, isNumberFieldEntryEdited, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';
import { useService } from '../hooks';
import { countDecimals, isValidNumber } from '../Util';

import Big from 'big.js';
import { useCallback } from 'preact/hooks';

export function NumberEntries(props) {
  const {
    editField,
    field,
    id
  } = props;

  const entries = [];

  entries.push({
    id: id + '-decimalDigits',
    component: NumberDecimalDigits,
    isEdited: isNumberFieldEntryEdited,
    editField,
    field,
    isDefaultVisible: (field) => field.type === 'number'
  });

  entries.push({
    id: id + '-step',
    component: NumberArrowStep,
    isEdited: isTextFieldEntryEdited,
    editField,
    field,
    isDefaultVisible: (field) => field.type === 'number'
  });

  return entries;
}

function NumberDecimalDigits(props) {

  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const getValue = (e) => get(field, [ 'decimalDigits' ]);

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, [ 'decimalDigits' ], value);
  };

  return NumberFieldEntry({
    debounce,
    label: 'Decimal digits',
    element: field,
    step: 'any',
    getValue,
    id,
    setValue,
    validate: validateNumberEntries
  });

}

function NumberArrowStep(props) {

  const {
    editField,
    field,
    id
  } = props;

  const {
    decimalDigits
  } = field;

  const debounce = useService('debounce');

  const getValue = (e) => {

    let value = get(field, [ 'increment' ]);

    if (!isValidNumber(value)) return null;

    return value;
  };

  const clearLeadingZeroes = (value) => {
    if (!value) return value;
    const trimmed = value.replace(/^0+/g, '');
    return (trimmed.startsWith('.') ? '0' : '') + trimmed;
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, [ 'increment' ], clearLeadingZeroes(value));
  };

  const decimalDigitsSet = decimalDigits || decimalDigits === 0;

  const validate = useCallback(
    (value) => {
      if (value === undefined || value === null) {
        return;
      }

      if (!isValidNumber(value)) {
        return 'Should be a valid number.';
      }

      if (Big(value).cmp(0) <= 0) {
        return 'Should be greater than zero.';
      }

      if (decimalDigitsSet) {
        const minimumValue = Big(`1e-${decimalDigits}`);

        if (Big(value).cmp(minimumValue) < 0) {
          return `Should be at least ${minimumValue.toString()}.`;
        }

        if (countDecimals(value) > decimalDigits) {
          return `Should not contain more than ${decimalDigits} decimal digits.`;
        }
      }
    },
    [ decimalDigitsSet, decimalDigits ],
  );

  return TextFieldEntry({
    debounce,
    label: 'Increment',
    element: field,
    getValue,
    id,
    setValue,
    validate
  });
}

// helpers //////////

/**
 * @param {number|void} value
 * @returns {string|void}
 */
const validateNumberEntries = (value) => {
  if (typeof value !== 'number') {
    return;
  }

  if (!Number.isInteger(value)) {
    return 'Should be an integer.';
  }

  if (value < 0) {
    return 'Should be greater than or equal to zero.';
  }
};
