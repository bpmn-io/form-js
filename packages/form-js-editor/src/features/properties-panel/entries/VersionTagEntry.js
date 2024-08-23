import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

export function VersionTagEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'versionTag',
    component: VersionTag,
    editField: editField,
    field: field,
    isEdited: isTextFieldEntryEdited,
    isDefaultVisible: (field) => field.type === 'default',
  });

  return entries;
}

function VersionTag(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const path = ['versionTag'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    return editField(field, path, value);
  };

  const tooltip = <div>Version tag by which this form can be referenced.</div>;

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Version tag',
    setValue,
    tooltip,
  });
}
