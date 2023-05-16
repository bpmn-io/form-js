import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { useService, useVariables } from '../hooks';

import { FeelToggleSwitchEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';


export default function ReadonlyEntry(props) {
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
      id: 'readonly',
      component: Readonly,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited
    });
  }

  return entries;
}

function Readonly(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = [ 'readonly' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || false);
  };

  return FeelToggleSwitchEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: 'Read only',
    setValue,
    variables
  });
}