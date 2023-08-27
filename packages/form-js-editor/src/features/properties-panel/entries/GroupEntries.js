
import { simpleBoolEntryFactory } from './factories';

export default function GroupEntries(props) {
  const {
    field,
  } = props;

  const {
    type
  } = field;

  if (type !== 'group') {
    return [];
  }

  const entries = [
    simpleBoolEntryFactory({
      id: 'showOutline',
      path: [ 'showOutline' ],
      label: 'Show outline',
      props
    })
  ];

  return entries;
}