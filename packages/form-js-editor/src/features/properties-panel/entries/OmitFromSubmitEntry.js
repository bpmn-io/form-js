import { get } from 'min-dash';

import { ToggleSwitchEntry, isToggleSwitchEntryEdited } from '@bpmn-io/properties-panel';

export function OmitFromSubmitEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'omit-from-submit',
    component: OmitFromSubmit,
    editField: editField,
    field: field,
    isEdited: isToggleSwitchEntryEdited,
    isDefaultVisible: (field) => !!field.key && field.type !== 'filepicker',
  });

  return entries;
}

function OmitFromSubmit(props) {
  const { editField, field, id } = props;

  const path = ['omitFromSubmit'];

  const getValue = () => {
    return get(field, path, false);
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return ToggleSwitchEntry({
    element: field,
    getValue,
    id,
    label: 'Omit from submission',
    tooltip: "When enabled, this field's value will not be included in the form submission data.",
    inline: true,
    setValue,
  });
}
