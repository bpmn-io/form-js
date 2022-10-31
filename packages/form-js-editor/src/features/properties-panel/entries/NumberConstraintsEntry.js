import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';

import { get } from 'min-dash';
import { useService } from '../hooks';

export default function NumberConstraintsEntry(props) {
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
    isEdited: isNumberFieldEntryEdited,
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

    let value = get(field, [ 'step' ]);

    if (!isNaN(parseFloat(value))) {
      value = +value.toFixed(decimalDigits);
    }

    return value;

  };

  const setValue = (value) => editField(field, [ 'step' ], value);

  return NumberFieldEntry({
    debounce,
    label: 'Step',
    element: field,
    min: 1 / (10 ** (isNaN(parseInt(decimalDigits)) ? 15 : decimalDigits)),
    step: 1 / (10 ** (isNaN(parseInt(decimalDigits)) ? 15 : decimalDigits)),
    getValue,
    id,
    setValue
  });

}