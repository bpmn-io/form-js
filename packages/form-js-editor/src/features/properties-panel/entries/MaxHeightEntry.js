import { get } from 'min-dash';

import { useService } from '../hooks';

import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';

export function MaxHeightEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'maxHeight',
    component: MaxHeight,
    editField: editField,
    field: field,
    isEdited: isNumberFieldEntryEdited,
    isDefaultVisible: (field) => field.type === 'documentPreview',
  });

  return entries;
}

function MaxHeight(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const path = ['maxHeight'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return NumberFieldEntry({
    debounce,
    label: 'Max height',
    element: field,
    id,
    getValue,
    setValue,
    validate,
  });
}

// helpers //////////

/**
 * @param {string|number|undefined} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'string') {
    return 'Value must be a number.';
  }

  if (!Number.isInteger(value)) {
    return 'Should be an integer.';
  }

  if (value < 1) {
    return 'Should be greater than zero.';
  }
};
