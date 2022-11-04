import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';


export default function SourceEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  if (type === 'image') {
    entries.push({
      id: 'source',
      component: Source,
      editField: editField,
      field: field,
      isEdited: isTextFieldEntryEdited
    });
  }

  return entries;
}

function Source(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const path = [ 'source' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return TextFieldEntry({
    debounce,
    description: 'Binds to a form variable',
    element: field,
    getValue,
    id,
    label: 'Source',
    setValue
  });
}