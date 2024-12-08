import { AdornerEntry, GroupAppearanceEntry, LayouterAppearanceEntry, MaxHeightEntry } from '../entries';

export function AppearanceGroup(field, editField, getService) {
  const entries = [
    ...AdornerEntry({ field, editField }),
    ...GroupAppearanceEntry({ field, editField }),
    ...LayouterAppearanceEntry({ field, editField }),
    ...MaxHeightEntry({ field, editField }),
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'appearance',
    label: 'Appearance',
    entries,
  };
}
