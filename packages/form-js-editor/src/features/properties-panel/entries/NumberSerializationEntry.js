import { CheckboxEntry, isCheckboxEntryEdited } from '@bpmn-io/properties-panel';

import { get } from 'min-dash';

import Big from 'big.js';

export default function NumberSerializationEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  if (type !== 'number') {
    return [];
  }

  const entries = [];

  entries.push({
    id: 'serialize-to-string',
    component: SerializeToString,
    isEdited: isCheckboxEntryEdited,
    editField,
    field
  });

  return entries;
}

function SerializeToString(props) {
  const {
    editField,
    field,
    id
  } = props;

  const {
    defaultValue
  } = field;

  const path = [ 'serializeToString' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {

    // Whenever changing the formatting, make sure to change the default value type along with it
    if (defaultValue || defaultValue === 0) {
      editField(field, [ 'defaultValue' ], value ? Big(defaultValue).toFixed() : Number(defaultValue));
    }

    return editField(field, path, value);
  };

  return CheckboxEntry({
    element: field,
    getValue,
    id,
    label: 'Output as string',
    description: 'Allows arbitrary precision values',
    setValue
  });
}