import { DirectionEntry } from '../entries/DirectionEntry';

export function StyleGroup(field, editField, getService) {
  const entries = [...DirectionEntry({ field, editField, getService })];

  if (entries.length === 0) {
    return null;
  }

  return {
    id: 'style',
    label: 'Style',
    entries,
  };
}
