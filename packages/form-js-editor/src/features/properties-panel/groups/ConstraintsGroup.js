import {
  DateTimeConstraintsEntry,
  NumberConstraintsEntry
} from '../entries';


export default function DisplayGroup(field, editField) {

  const entries = [
    ...DateTimeConstraintsEntry({ field, editField }),
    ...NumberConstraintsEntry({ field, editField })
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'constraints',
    label: 'Constraints',
    entries
  };
}