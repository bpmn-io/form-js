import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { ToggleSwitchEntry, isToggleSwitchEntryEdited } from '@bpmn-io/properties-panel';


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
      isEdited: isToggleSwitchEntryEdited
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

  const path = [ 'disabled' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return ToggleSwitchEntry({
    element: field,
    getValue,
    id,
    label: 'Disabled',
    inline: true,
    setValue
  });
}