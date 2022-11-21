import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export default function SourceEntry(props) {
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
      id: 'source',
      component: Source,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited
    });
  }

  return entries;
}

function Source(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = [ 'source' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelEntry({
    debounce,
    description: 'Expression or static value (link/data URI)',
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: 'Image source',
    setValue,
    variables
  });
}
