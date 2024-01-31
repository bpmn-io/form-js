import {
  get,
  set
} from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry } from '@bpmn-io/properties-panel';
import { useMemo } from 'preact/hooks';


export function ValueEntry(props) {
  const {
    editField,
    field,
    idPrefix,
    index,
    validateFactory
  } = props;

  const entries = [
    {
      component: Label,
      editField,
      field,
      id: idPrefix + '-label',
      idPrefix,
      index,
      validateFactory
    },
    {
      component: Value,
      editField,
      field,
      id: idPrefix + '-value',
      idPrefix,
      index,
      validateFactory
    }
  ];

  return entries;
}

function Label(props) {
  const {
    editField,
    field,
    id,
    index,
    validateFactory
  } = props;

  const debounce = useService('debounce');

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    const values = get(field, [ 'values' ]);
    return editField(field, 'values', set(values, [ index, 'label' ], value));
  };

  const getValue = () => {
    return get(field, [ 'values', index, 'label' ]);
  };

  const validate = useMemo(
    () =>
      validateFactory(
        get(field, [ 'values', index, 'label' ]),
        (entry) => entry.label,
      ),
    [ field, index, validateFactory ],
  );

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Label',
    setValue,
    validate
  });
}

function Value(props) {
  const {
    editField,
    field,
    id,
    index,
    validateFactory
  } = props;

  const debounce = useService('debounce');

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    const values = get(field, [ 'values' ]);
    return editField(field, 'values', set(values, [ index, 'value' ], value));
  };

  const getValue = () => {
    return get(field, [ 'values', index, 'value' ]);
  };

  const validate = useMemo(
    () =>
      validateFactory(
        get(field, [ 'values', index, 'value' ]),
        (entry) => entry.value,
      ),
    [ field, index, validateFactory ],
  );

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Value',
    setValue,
    validate
  });
}