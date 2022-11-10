import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import { get } from 'min-dash';
import { useService } from '../hooks';

export default function AdornerEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  const {
    type
  } = field;

  const entries = [];

  if ([ 'number', 'textfield' ].includes(type)) {
    entries.push({
      id: id + '-prefix-adorner',
      component: PrefixAdorner,
      isEdited: isTextFieldEntryEdited,
      editField,
      field
    });

    entries.push({
      id: id + '-suffix-adorner',
      component: SuffixAdorner,
      isEdited: isTextFieldEntryEdited,
      editField,
      field
    });
  }

  return entries;
}

function PrefixAdorner(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const path = [ 'prefixAdorner' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Prefixed adorner',
    setValue
  });
}

function SuffixAdorner(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const path = [ 'suffixAdorner' ];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Suffixed adorner',
    setValue
  });
}