import { isUndefined, without } from 'min-dash';
import { arrayAdd } from '../Util';
import ValueEntry from './ValueEntry';
import { VALUES_SOURCES, VALUES_SOURCES_PATHS } from '@bpmn-io/form-js-viewer';

export default function StaticValuesSourceEntry(props) {
  const {
    editField,
    field,
    id: idPrefix
  } = props;

  const {
    values
  } = field;

  const addEntry = (e) => {

    e.stopPropagation();

    const index = values.length + 1;

    const entry = getIndexedEntry(index, values);

    editField(field, VALUES_SOURCES_PATHS[VALUES_SOURCES.STATIC], arrayAdd(values, values.length, entry));
  };

  const removeEntry = (entry) => {
    editField(field, VALUES_SOURCES_PATHS[VALUES_SOURCES.STATIC], without(values, entry));
  };

  const validateFactory = (key, getValue) => {
    return (value) => {
      if (value === key) {
        return;
      }

      if (isUndefined(value) || !value.length) {
        return 'Must not be empty.';
      }

      const isValueAssigned = values.find(entry => getValue(entry) === value);

      if (isValueAssigned) {
        return 'Must be unique.';
      }
    };
  };

  const items = values.map((entry, index) => {
    const id = idPrefix + '-' + index;

    return {
      id,
      label: entry.label,
      entries: ValueEntry({
        editField,
        field,
        idPrefix: id,
        index,
        validateFactory
      }),
      autoFocusEntry: id + '-label',
      remove: () => removeEntry(entry)
    };
  });

  return {
    items,
    add: addEntry,
    shouldSort: false
  };
}


// helper

function getIndexedEntry(index, values) {
  const entry = {
    label: 'Value',
    value: 'value'
  };

  while (labelOrValueIsAlreadyAssignedForIndex(index, values)) {
    index++;
  }

  if (index > 1) {
    entry.label += ` ${index}`;
    entry.value += `${index}`;
  }

  return entry;
}

function labelOrValueIsAlreadyAssignedForIndex(index, values) {
  return values.some(existingEntry =>
    existingEntry.label === `Value ${index}` ||
    existingEntry.value === `value${index}`);
}