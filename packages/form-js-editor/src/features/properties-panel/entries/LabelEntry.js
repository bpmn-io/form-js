import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { useService } from '../hooks';


import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';


export default function LabelEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  if (INPUTS.includes(type) || type === 'button') {
    entries.push({
      id: 'label',
      component: Label,
      editField: editField,
      field: field,
      isEdited: isTextFieldEntryEdited
    });
  }

  return entries;
}

function Label(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const path = [ 'label' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Field label',
    setValue
  });
}