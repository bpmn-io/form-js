import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';

import { get } from 'min-dash';
import { useService } from '../hooks';

export default function SpacerEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  const {
    type
  } = field;

  if (type !== 'spacer') {
    return [];
  }

  const entries = [];

  entries.push({
    id: id + '-height',
    component: SpacerHeight,
    isEdited: isNumberFieldEntryEdited,
    editField,
    field
  });

  return entries;
}

function SpacerHeight(props) {

  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const getValue = (e) => get(field, [ 'height' ]);

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, [ 'height' ], value);
  };

  return NumberFieldEntry({
    debounce,
    label: 'Height',
    element: field,
    id,
    getValue,
    setValue,
    validate: (value) => {
      if (value === undefined || value === null) return;
      if (value < 1) return 'Should be greater than zero.';
      if (!Number.isInteger(value)) return 'Should be an integer.';
    }
  });
}
