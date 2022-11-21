import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export default function AltTextEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  if (type === 'image') {
    entries.push({
      id: 'alt',
      component: AltText,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited
    });
  }

  return entries;
}

function AltText(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = [ 'alt' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: 'Alternative text',
    setValue,
    variables
  });
}
