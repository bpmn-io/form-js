import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { ToggleSwitchEntry, isToggleSwitchEntryEdited } from '@bpmn-io/properties-panel';

export function DisabledEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'disabled',
    component: Disabled,
    editField: editField,
    field: field,
    isEdited: isToggleSwitchEntryEdited,
    isDefaultVisible: (field) => INPUTS.includes(field.type),
  });

  return entries;
}

function Disabled(props) {
  const { editField, field, id } = props;

  const path = ['disabled'];

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
    tooltip:
      'Disable this field when it should not be interactive for end-users. Its data will not be submitted. This setting takes precedence over read-only.',
    inline: true,
    setValue,
  });
}
