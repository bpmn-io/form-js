import { NumberFieldEntry, isNumberFieldEntryEdited, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import Big from 'big.js';
import { get } from 'min-dash';
import { useService } from '../hooks';
import { countDecimals, isValidNumber } from '../Util';

export default function NumberEntries(props) {
  const {
    editField,
    field,
    id
  } = props;

  const {
    type
  } = field;

  if (type !== 'number') {
    return [];
  }

  const entries = [];

  entries.push({
    id: id + '-decimalDigits',
    component: NumberDecimalDigits,
    isEdited: isNumberFieldEntryEdited,
    editField,
    field
  });

  entries.push({
    id: id + '-step',
    component: NumberArrowStep,
    isEdited: isTextFieldEntryEdited,
    editField,
    field
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

  const setValue = (value) => editField(field, [ 'decimalDigits' ], value);

  return NumberFieldEntry({
    debounce,
    label: 'Decimal digits',
    element: field,
    step: 'any',
    getValue,
    id,
    setValue,
    validate: (value) => {
      if (value === undefined || value === null) return;
      if (value < 0) return 'Should be greater than or equal to zero.';
      if (!Number.isInteger(value)) return 'Should be an integer.';
    }
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

  const setValue = (value) => editField(field, [ 'increment' ], clearLeadingZeroes(value));

  const decimalDigitsSet = decimalDigits || decimalDigits === 0;

  return TextFieldEntry({
    debounce,
    label: 'Increment',
    element: field,
    getValue,
    id,
    setValue,
    validate: (value) => {

      if (value === undefined || value === null) return;

      if (!isValidNumber(value)) return 'Should be a valid number.';

      if (Big(value).cmp(0) <= 0) return 'Should be greater than zero.';

      if (decimalDigitsSet) {
        const minimumValue = Big(`1e-${decimalDigits}`);

        if (Big(value).cmp(minimumValue) < 0) return `Should be at least ${minimumValue.toString()}.`;
        if (countDecimals(value) > decimalDigits) return `Should not contain more than ${decimalDigits} decimal digits.`;

      }
    }
  });

}