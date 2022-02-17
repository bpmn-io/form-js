import {
  CollapsibleEntry,
  Group
} from '../components';

import {
  has,
  isUndefined
} from 'min-dash';

import { CustomValueEntry } from '../entries';

export default function CustomValuesGroup(field, editField) {
  const {
    id,
    properties = {}
  } = field;

  const addEntry = () => {
    const index = Object.keys(properties).length + 1;

    const key = `key${ index }`,
          value = 'value';

    editField(field, [ 'properties' ], { ...properties, [ key ]: value });
  };

  const validateFactory = (key) => {
    return (value) => {
      if (value === key) {
        return;
      }

      if (isUndefined(value) || !value.length) {
        return 'Must not be empty.';
      }

      if (has(properties, value)) {
        return 'Must be unique.';
      }
    };
  };

  const hasEntries = Object.keys(properties).length > 0;

  return (
    <Group label="Custom Properties" addEntry={ addEntry } hasEntries={ hasEntries }>
      {
        Object.keys(properties).map((key, index) => {
          const removeEntry = () => {
            editField(field, [ 'properties' ], removeKey(properties, key));
          };

          return (
            <CollapsibleEntry key={ `${ id }-${ index }` } label={ key } removeEntry={ removeEntry }>
              <CustomValueEntry editField={ editField } field={ field } index={ index } validate={ validateFactory } />
            </CollapsibleEntry>
          );
        })
      }
    </Group>
  );
}

// helpers //////////

/**
 * Returns copy of object without key.
 *
 * @param {Object} properties
 * @param {string} oldKey
 *
 * @returns {Object}
 */
export function removeKey(properties, oldKey) {
  return Object.entries(properties).reduce((newProperties, entry) => {
    const [ key, value ] = entry;

    if (key === oldKey) {
      return newProperties;
    }

    return {
      ...newProperties,
      [ key ]: value
    };
  }, {});
}