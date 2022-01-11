import {
  CollapsibleEntry,
  Group
} from '../components';

import { ValueEntry } from '../entries';

import {
  arrayAdd,
  arrayRemove
} from '../Util';

export default function ValuesGroup(field, editField) {
  const {
    id,
    values = []
  } = field;

  const addEntry = () => {
    const entry = {
      label: 'Value',
      value: 'value'
    };

    editField(field, [ 'values' ], arrayAdd(values, values.length, entry));
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
              <ValueEntry editField={ editField } field={ field } index={ index } />
            </CollapsibleEntry>
          );
        })
      }
    </Group>
  );
}