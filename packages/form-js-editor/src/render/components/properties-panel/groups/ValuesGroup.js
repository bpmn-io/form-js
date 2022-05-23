import { ListGroup } from '@bpmn-io/properties-panel';

import { ValueEntry } from '../entries';

import {
  arrayAdd,
  arrayRemove,
  OPTIONS_INPUTS
} from '../Util';

import {
  isUndefined
} from 'min-dash';

// todo(pinussilvestrus): move me to a normal group with nested list
// (cf. https://github.com/bpmn-io/form-js/issues/197#issuecomment-1116047809)
export default function ValuesGroup(field, editField) {
  const {
    values = [],
    type
  } = field;

  if (!OPTIONS_INPUTS.includes(type)) {
    return null;
  }

  const addEntry = (event) => {
    event.stopPropagation();

    const index = values.length + 1;

    const entry = {
      label: `Value ${ index }`,
      value: `value${ index }`
    };

    editField(field, [ 'values' ], arrayAdd(values, values.length, entry));
  };

  const validateFactory = (key) => {
    return (value) => {
      if (value === key) {
        return;
      }

      if (isUndefined(value) || !value.length) {
        return 'Must not be empty.';
      }

      const isValueAssigned = values.find(entry => entry.value === value);

      if (isValueAssigned) {
        return 'Must be unique.';
      }
    };
  };

  const items = values.map((value, index) => {
    const {
      label
    } = value;

    const removeEntry = (event) => {
      event.stopPropagation();

      editField(field, [ 'values' ], arrayRemove(values, index));
    };

    const id = `${ field.id }-value-${ index }`;

    return {
      autoFocusEntry: id + '-label',
      entries: ValueEntry({
        editField,
        field,
        idPrefix: id,
        index,
        validateFactory
      }),
      id,
      label: label || '',
      remove: removeEntry
    };
  });

  return {
    add: addEntry,
    component: ListGroup,
    id: 'values',
    items,
    label: 'Values',
    shouldSort: false
  };
}