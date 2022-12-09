import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTextAreaEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';


export default function TextEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  if (type !== 'text') {
    return [];
  }

  return [
    {
      id: 'text',
      component: Text,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited
    }
  ];
}

function Text(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = [ 'text' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTextAreaEntry({
    debounce,
    description: 'Use an Expression, Markdown or basic HTML to format.',
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: 'Text',
    rows: 10,
    setValue,
    variables
  });
}