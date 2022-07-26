import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry } from '@bpmn-io/properties-panel';


export default function CustomValueEntry(props) {
  const {
    editField,
    field,
    idPrefix,
    index,
    validateFactory
  } = props;

  const entries = [
    {
      component: Key,
      editField,
      field,
      id: idPrefix + '-key',
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

function Key(props) {
  const {
    editField,
    field,
    id,
    index,
    validateFactory
  } = props;

  const debounce = useService('debounce');

  const setValue = (value) => {
    const properties = get(field, [ 'properties' ]);
    const key = Object.keys(properties)[ index ];
    return editField(field, 'properties', updateKey(properties, key, value));
  };

  const getValue = () => {
    return Object.keys(get(field, [ 'properties' ]))[ index ];
  };

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Key',
    setValue,
    validate: validateFactory(getValue())
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

  const setValue = (value) => {
    const properties = get(field, [ 'properties' ]);
    const key = Object.keys(properties)[ index ];
    editField(field, 'properties', updateValue(properties, key, value));
  };

  const getValue = () => {
    const properties = get(field, [ 'properties' ]);
    const key = Object.keys(properties)[ index ];
    return get(field, [ 'properties', key ]);
  };

  return TextFieldEntry({
    debounce,
    element: field,
    getValue,
    id,
    label: 'Value',
    setValue,
    validate: validateFactory(getValue())
  });
}


// helpers //////////

/**
 * Returns copy of object with updated value.
 *
 * @param {Object} properties
 * @param {string} key
 * @param {string} value
 *
 * @returns {Object}
 */
function updateValue(properties, key, value) {
  return {
    ...properties,
    [ key ]: value
  };
}

/**
 * Returns copy of object with updated key.
 *
 * @param {Object} properties
 * @param {string} oldKey
 * @param {string} newKey
 *
 * @returns {Object}
 */
function updateKey(properties, oldKey, newKey) {
  return Object.entries(properties).reduce((newProperties, entry) => {
    const [ key, value ] = entry;

    return {
      ...newProperties,
      [ key === oldKey ? newKey : key ]: value
    };
  }, {});
}