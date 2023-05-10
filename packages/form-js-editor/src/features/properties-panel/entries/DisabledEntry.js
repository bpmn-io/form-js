import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { useService, useVariables } from '../hooks';

import { FeelCheckboxEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';


export default function DisabledEntry(props) {
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
      id: 'disabled',
      component: Disabled,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited
    });
  }

  return entries;
}

function Disabled(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = [ 'disabled' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelCheckboxEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: 'Disabled',
    setValue,
    variables
  });
}