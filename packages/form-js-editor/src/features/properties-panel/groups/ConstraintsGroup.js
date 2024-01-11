import {
  DateTimeConstraintsEntry
} from '../entries';


export function ConstraintsGroup(field, editField) {

  const entries = [
    ...DateTimeConstraintsEntry({ field, editField })
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