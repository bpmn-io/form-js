import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function DescriptionEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'description',
    component: Description,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => INPUTS.includes(field.type),
  });

  return entries;
}

function Description(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables();

  const path = ['description'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Field description',
    singleLine: true,
    setValue,
    variables,
  });
}
