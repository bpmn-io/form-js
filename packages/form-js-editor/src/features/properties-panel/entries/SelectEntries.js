
import { simpleBoolEntryFactory } from './factories';

export default function SelectEntries(props) {
  const entries = [
    simpleBoolEntryFactory({
      id: 'searchable',
      path: [ 'searchable' ],
      label: 'Searchable',
      props,
      isDefaultVisible: (field) => field.type === 'select'
    })
  ];

  return entries;
}