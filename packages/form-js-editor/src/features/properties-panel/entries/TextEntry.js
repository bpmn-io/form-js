import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextAreaEntry, isTextAreaEntryEdited } from '@bpmn-io/properties-panel';


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
      isEdited: isTextAreaEntryEdited
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

  const path = [ 'text' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return TextAreaEntry({
    debounce,
    description: 'Use Markdown or basic HTML to format.',
    element: field,
    getValue,
    id,
    label: 'Text',
    rows: 10,
    setValue
  });
}