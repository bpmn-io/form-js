import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

import { get, set } from 'min-dash';
import { useService, useVariables } from '../hooks';

export function AdornerEntry(props) {
  const {
    editField,
    field
  } = props;

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

  entries.push({
    id: 'prefix-adorner',
    component: PrefixAdorner,
    isEdited: isFeelEntryEdited,
    editField,
    field,
    onChange,
    getValue,
    isDefaultVisible: (field) => [ 'number', 'textfield' ].includes(field.type)
  });

  entries.push({
    id: 'suffix-adorner',
    component: SuffixAdorner,
    isEdited: isFeelEntryEdited,
    editField,
    field,
    onChange,
    getValue,
    isDefaultVisible: (field) => [ 'number', 'textfield' ].includes(field.type)
  });

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

  const variables = useVariables().map(name => ({ name }));

  return FeelTemplatingEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue: getValue('prefixAdorner'),
    id,
    label: 'Prefix',
    setValue: onChange('prefixAdorner'),
    singleLine: true,
    variables
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

  const variables = useVariables().map(name => ({ name }));

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue: getValue('suffixAdorner'),
    id,
    label: 'Suffix',
    setValue: onChange('suffixAdorner'),
    singleLine: true,
    variables
  });
}