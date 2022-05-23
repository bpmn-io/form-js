import { get } from 'min-dash';

import { useService } from '../../../hooks';

import { INPUTS } from '../Util';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';


export default function DescriptionEntry(props) {
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
      id: 'description',
      component: Description,
      editField: editField,
      field: field,
      isEdited: isTextFieldEntryEdited
    });
  }

  return entries;
}


function Description(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const path = [ 'description' ];

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
    label: 'Field description',
    setValue
  });
}