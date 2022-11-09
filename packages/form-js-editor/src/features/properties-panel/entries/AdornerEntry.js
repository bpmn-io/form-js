import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import { get, set } from 'min-dash';
import { useService } from '../hooks';

export default function AdornerEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    type
  } = field;

  const entries = [];

  const onChange = (key) => {
    return (value) => {
      const appearance = get(field, [ 'appearance' ], {});

      editField(field, [ 'appearance' ], set(appearance, [ key ], value));
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, [ 'appearance', key ]);
    };
  };

  if ([ 'number', 'textfield' ].includes(type)) {
    entries.push({
      id: 'prefix-adorner',
      component: PrefixAdorner,
      isEdited: isTextFieldEntryEdited,
      editField,
      field,
      onChange,
      getValue
    });

    entries.push({
      id: 'suffix-adorner',
      component: SuffixAdorner,
      isEdited: isTextFieldEntryEdited,
      editField,
      field,
      onChange,
      getValue
    });
  }

  return entries;
}

function PrefixAdorner(props) {
  const {
    field,
    id,
    onChange,
    getValue
  } = props;

  const debounce = useService('debounce');

  return TextFieldEntry({
    debounce,
    element: field,
    getValue: getValue('prefixAdorner'),
    id,
    label: 'Prefix',
    setValue: onChange('prefixAdorner')
  });
}

function SuffixAdorner(props) {
  const {
    field,
    id,
    onChange,
    getValue
  } = props;

  const debounce = useService('debounce');

  return TextFieldEntry({
    debounce,
    element: field,
    getValue: getValue('suffixAdorner'),
    id,
    label: 'Suffix',
    setValue: onChange('suffixAdorner')
  });
}