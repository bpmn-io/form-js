import { isUndefined } from 'min-dash';

import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';


export default function KeyEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  if (INPUTS.includes(type)) {
    entries.push({
      id: 'key',
      component: Key,
      editField: editField,
      field: field,
      isEdited: isTextFieldEntryEdited
    });
  }

  return entries;
}

function Key(props) {
  const {
    editField,
    field,
    id
  } = props;

  const pathRegistry = useService('pathRegistry');

  const debounce = useService('debounce');

  const path = [ 'key' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    return editField(field, path, value);
  };

  const validate = (value) => {

    if (value === field.key) {
      return null;
    }

    if (isUndefined(value) || !value.length) {
      return 'Must not be empty.';
    }

    if (/\s/.test(value)) {
      return 'Must not contain spaces.';
    }

    const currentPath = pathRegistry.getValuePath(field);

    // ignore if the path is unchanged
    if (currentPath.length > 0 && currentPath[-1] === value) {
      return null;
    }

    const newPath = [ ...currentPath.slice(0, -1), value ];

    if (!pathRegistry.canClaimPath(newPath, true)) {
      return 'Must not conflict with other key/path assignments.';
    }

    return null;
  };

  return TextFieldEntry({
    debounce,
    description: 'Binds to a form variable',
    element: field,
    getValue,
    id,
    label: 'Key',
    tooltip: 'Use a unique "key" to link the form element and the related input/output data. When dealing with nested data, break it down in the user task\'s input mapping before using it.',
    setValue,
    validate
  });
}