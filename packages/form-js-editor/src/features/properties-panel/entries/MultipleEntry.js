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
  const fieldValue = get(field, path, false);

  const getValue = () => {
    return fieldValue;
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
    label: 'Upload multiple files',
    inline: true,
    setValue,
    variables,
    description: fieldValue ? (
      <>
        The picker variable will return an <strong class="bio-properties-panel-strong">array</strong> with multiple
        files
      </>
    ) : (
      <>
        The picker variable will return an <strong class="bio-properties-panel-strong">array</strong> with single
      </>
    ),
  });
}
