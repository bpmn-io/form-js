import {
  CollapsibleEntry,
  Group
} from '../components';

import { isUndefined } from 'min-dash';

import { CustomValueEntry } from '../entries';

export default function CustomValuesGroup(field, editField) {
  const {
    id,
    properties = []
  } = field;

  const addEntry = () => {
    const index = Object.keys(properties).length + 1;
    const entry = {};

    let key = properties.key ? `key ${index}` : 'key';

    entry[key] = 'value';

    editField(field, [ 'properties' ], { ...properties, ...entry });
  };

  const validateFactory = (key) => {
    return (value) => {

      if (value === key) {
        return;
      }

      if (isUndefined(value) || !value.length) {
        return 'Must not be empty.';
      }

      if (properties[value])
        return 'Must be unique.';
    };
  };

  const hasEntries = Object.keys(properties).length > 0;

  return (
    <Group label="Custom Properties" addEntry={ addEntry } hasEntries={ hasEntries }>
      {
        Object.keys(properties).map((key, index) => {

          const removeEntry = () => {
            delete properties[key];
            editField(field, [ 'properties' ], properties);
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