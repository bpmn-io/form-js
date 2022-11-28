import { NumberFieldEntry, isNumberFieldEntryEdited, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import Big from 'big.js';
import { get } from 'min-dash';
import { useService } from '../hooks';
import { countDecimals, isValidNumber } from '../Util';

export default function NumberEntry(props) {
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
    min: 0,
    step: 1,
    getValue,
    id,
    setValue
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

  const setValue = (value) => editField(field, [ 'increment' ], value);

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

      if (!decimalDigitsSet && Big(value).cmp(0) <= 0) return 'Should be greater than zero.';

      if (decimalDigitsSet) {
        const minimumValue = Big(`1e-${decimalDigits}`);

        if (Big(value).cmp(minimumValue) < 0) return `Should be at least ${minimumValue.toString()}.`;
        if (countDecimals(value) > decimalDigits) return `Should not contain more than ${decimalDigits} decimal digits.`;

      }
    }
  });

}