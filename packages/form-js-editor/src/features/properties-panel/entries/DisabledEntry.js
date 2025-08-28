import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { ToggleSwitchEntry, isToggleSwitchEntryEdited } from '@bpmn-io/properties-panel';

export function DisabledEntry(props) {
  const { editField, field, getService } = props;

  const entries = [];

  let translate = getService('translate');

  entries.push({
    id: 'disabled',
    component: Disabled,
    editField: editField,
    field: field,
    isEdited: isToggleSwitchEntryEdited,
    isDefaultVisible: (field) => INPUTS.includes(field.type),
    translate : translate,
  });

  return entries;
}

function Disabled(props) {
  const { editField, field, id, translate } = props;

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
    label: translate('Disabled'),
    tooltip:
      translate('Disabled tooltip'),
    inline: true,
    setValue,
  });
}
