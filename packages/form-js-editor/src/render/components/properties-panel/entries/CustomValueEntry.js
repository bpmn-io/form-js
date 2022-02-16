import { get } from 'min-dash';

import { TextInputEntry } from '../components';

export default function CustomValueEntry(props) {
  const {
    editField,
    field,
    index,
    validate
  } = props;

  const onChange = (key) => {
    let properties = get(field, [ 'properties' ]);

    return (newValue) => {
      if (key == 'value') {
        properties[getKey()] = newValue;
      }

      else if (key == 'key') {
        properties = updateObjectKey(properties, getKey(), newValue);
      }

      editField(field, 'properties', properties);
    };
  };

  const getKey = () => {
    return Object.keys(get(field, [ 'properties']))[index];
  };

  const getValue = () => {
    const properties = get(field, [ 'properties']);
    return properties[getKey()];
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

// helpers
function updateObjectKey(object, oldKey, newKey) {
  const keys = Object.keys(object);
  const newObject = {};

  keys.forEach(key => {

    if (key === oldKey) {
      newObject[newKey] = object[key];
    }

    else newObject[key] = object[key];
  });

  return newObject;
}
