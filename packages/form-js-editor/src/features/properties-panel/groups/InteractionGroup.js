import {
  DisabledEntry,
  ReadonlyEntry
} from '../entries';


export default function InteractionGroup(field, editField) {

  const entries = [
    ...DisabledEntry({ field, editField }),
    ...ReadonlyEntry({ field, editField })
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'interaction',
    label: 'Interaction',
    entries
  };
}