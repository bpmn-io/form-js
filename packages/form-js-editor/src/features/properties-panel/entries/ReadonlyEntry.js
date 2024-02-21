import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { useService, useVariables } from '../hooks';

import { FeelToggleSwitchEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';


export function ReadonlyEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    disabled
  } = field;

  const entries = [];

  if (!disabled) {
    entries.push({
      id: 'readonly',
      component: Readonly,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited,
      isDefaultVisible: (field) => INPUTS.includes(field.type)
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
    tooltip: 'Field cannot be edited by the end-user, but the data will still be submitted.',
    setValue,
    variables
  });
}