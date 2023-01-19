
import { simpleBoolEntryFactory } from './factories';

export default function SelectEntries(props) {
  const {
    field,
  } = props;

  const {
    type
  } = field;

  if (type !== 'select') {
    return [];
  }

  const entries = [
    simpleBoolEntryFactory({
      id: 'searchable',
      path: [ 'searchable' ],
      label: 'Searchable',
      props
    })
  ];

  return entries;
}