import {
  AdornerEntry,
  RepeatableAppearanceEntry
} from '../entries';


export default function AppearanceGroup(field, editField, getService) {

  const entries = [
    ...AdornerEntry({ field, editField }),
    ...RepeatableAppearanceEntry({ field, editField, getService })
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