import { get } from 'min-dash';

import { TextInputEntry } from '../components';

export default function CustomValueEntry(props) {
  const {
    editField,
    field,
    index,
    validate
  } = props;

  const getKey = () => {
    return Object.keys(get(field, [ 'properties' ]))[ index ];
  };

  const getValue = () => {
    return get(field, [ 'properties', getKey() ]);
  };

  const onChange = (key) => {
    const properties = get(field, [ 'properties' ]);

    return (value) => {
      if (key === 'value') {
        editField(field, 'properties', updateValue(properties, getKey(), value));
      } else if (key === 'key') {
        editField(field, 'properties', updateKey(properties, getKey(), value));
      }
    };
  };

  return <>
    <TextInputEntry
      id={ `value-key-${ index }` }
      label="Key"
      onChange={ onChange('key') }
      value={ getKey() }
      validate={ validate(getKey()) } />
    <TextInputEntry
      id={ `value-value-${ index }` }
      label="Value"
      onChange={ onChange('value') }
      value={ getValue() } />
  </>;
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
      [ key === oldKey ? newKey: key ]: value
    };
  }, {});
}