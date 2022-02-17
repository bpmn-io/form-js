import {
  CollapsibleEntry,
  Group
} from '../components';

import { ValueEntry } from '../entries';

import {
  arrayAdd,
  arrayRemove
} from '../Util';

import {
  isUndefined
} from 'min-dash';


export default function ValuesGroup(field, editField) {
  const {
    id,
    values = []
  } = field;

  const addEntry = () => {
    const index = values.length + 1;

    const entry = {
      label: `Value ${ index }`,
      value: `value${ index }`
    };

    editField(field, [ 'values' ], arrayAdd(values, values.length, entry));
  };

  const validateFactory = (key) => {
    return (value) => {
      if (value === key) {
        return;
      }

      if (isUndefined(value) || !value.length) {
        return 'Must not be empty.';
      }

      const isValueAssigned = values.find(entry => entry.value === value);

      if (isValueAssigned) {
        return 'Must be unique.';
      }
    };
  };

  const hasEntries = values.length > 0;

  return (
    <Group label="Values" addEntry={ addEntry } hasEntries={ hasEntries }>
      {
        values.map((value, index) => {
          const { label } = value;

          const removeEntry = () => {
            editField(field, [ 'values' ], arrayRemove(values, index));
          };

          return (
            <CollapsibleEntry key={ `${ id }-${ index }` } label={ label } removeEntry={ removeEntry }>
              <ValueEntry editField={ editField } field={ field } index={ index } validate={ validateFactory } />
            </CollapsibleEntry>
          );
        })
      }
    </Group>
  );
}