import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelToggleSwitchEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function MultipleEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'multiple',
    component: Multiple,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'filepicker',
  });

  return entries;
}

function Multiple(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['multiple'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelToggleSwitchEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: 'Select multiple files',
    inline: true,
    setValue,
    variables,
  });
}
