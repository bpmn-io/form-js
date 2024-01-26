import {
  get,
  set,
  isString
} from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry } from '@bpmn-io/properties-panel';

const path = 'columns';
const labelPath = 'label';
const keyPath = 'key';

export function ColumnEntry(props) {
  const {
    editField,
    field,
    idPrefix,
    index
  } = props;

  const entries = [
    {
      component: Label,
      editField,
      field,
      id: idPrefix + '-label',
      idPrefix,
      index
    },
    {
      component: Key,
      editField,
      field,
      id: idPrefix + '-key',
      idPrefix,
      index
    }
  ];

  return entries;
}

function Label(props) {
  const {
    editField,
    field,
    id,
    index
  } = props;

  const debounce = useService('debounce');

  /**
    * @param {string|void} value
    * @param {string|void} error
    * @returns {void}
    */
  const setValue = (value, error) => {
    if (error) {
      return;
    }

    const columns = get(field, [ path ]);
    editField(field, path, set(columns, [ index, labelPath ], value));
  };

  const getValue = () => {
    return get(field, [ path, index, labelPath ]);
  };

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Label',
    setValue
  });
}

function Key(props) {
  const {
    editField,
    field,
    id,
    index
  } = props;

  const debounce = useService('debounce');

  /**
    * @param {string|void} value
    * @param {string|void} error
    * @returns {void}
    */
  const setValue = (value, error) => {
    if (error) {
      return;
    }

    const columns = get(field, [ path ]);
    editField(field, path, set(columns, [ index, keyPath ], value));
  };

  const getValue = () => {
    return get(field, [ path, index, keyPath ]);
  };

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Key',
    setValue,
    validate
  });
}


// helpers //////////////////////

/**
  * @param {string|void} value
  * @returns {string|null}
  */
function validate(value) {
  if (!isString(value) || value.length === 0) {
    return 'Must not be empty.';
  }

  return null;
}