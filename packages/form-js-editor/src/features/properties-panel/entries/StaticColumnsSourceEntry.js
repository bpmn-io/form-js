import { without } from 'min-dash';
import { arrayAdd } from '../Util';
import { ColumnEntry } from './ColumnEntry';

const path = [ 'columns' ];

export function StaticColumnsSourceEntry(props) {
  const {
    editField,
    field,
    id: idPrefix
  } = props;

  const {
    columns
  } = field;

  const addEntry = (event) => {

    event.stopPropagation();

    const entry = {
      label: 'Column',
      key: 'inputVariable'
    };

    editField(field, path, arrayAdd(columns, columns.length, entry));
  };

  const removeEntry = (entry) => {
    editField(field, path, without(columns, entry));
  };

  const items = columns.map((entry, index) => {
    const id = `${idPrefix}-${index}`;

    return {
      id,
      label: entry.label || entry.key,
      entries: ColumnEntry({
        editField,
        field,
        idPrefix: id,
        index
      }),
      autoFocusEntry: `${id}-label`,
      remove: () => removeEntry(entry)
    };
  });

  return {
    items,
    add: addEntry,
    shouldSort: false
  };
}
