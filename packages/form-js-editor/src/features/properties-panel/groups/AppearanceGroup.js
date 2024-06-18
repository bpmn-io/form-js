import { AdornerEntry, GroupAppearanceEntry, LayouterAppearanceEntry, DirectionEntry } from '../entries';

export function AppearanceGroup(field, editField, getService) {
  const entries = [
    ...AdornerEntry({ field, editField }),
    ...GroupAppearanceEntry({ field, editField }),
    ...LayouterAppearanceEntry({ field, editField }),
    ...LayouterAppearanceEntry({ field, editField }),
    ...DirectionEntry({ field, editField, getService }),

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
