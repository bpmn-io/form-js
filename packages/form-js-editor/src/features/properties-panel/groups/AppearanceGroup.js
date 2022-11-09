import {
  AdornerEntry
} from '../entries';


export default function AppearanceGroup(field, editField) {

  const entries = [
    ...AdornerEntry({ field, editField })
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'appearance',
    label: 'Appearance',
    entries
  };
}