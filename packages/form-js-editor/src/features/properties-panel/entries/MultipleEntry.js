import { get } from 'min-dash';

import { ToggleSwitchEntry, isToggleSwitchEntryEdited } from '@bpmn-io/properties-panel';

export function MultipleEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'multiple',
    component: Multiple,
    editField: editField,
    field: field,
    isEdited: isToggleSwitchEntryEdited,
    isDefaultVisible: (field) => field.type === 'filepicker',
  });

  return entries;
}

function Multiple(props) {
  const { editField, field, id } = props;

  const path = ['multiple'];

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
    label: 'Can upload multiple files',
    inline: true,
    setValue,
  });
}
