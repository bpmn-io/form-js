import { AdornerEntry, GroupAppearanceEntry, LayouterAppearanceEntry, MaxHeightEntry } from '../entries';

export function AppearanceGroup(field, editField, getService) {
  const translate = getService('translate');
  const entries = [
    ...AdornerEntry({ field, editField }),
    ...GroupAppearanceEntry({ field, editField, translate }),
    ...LayouterAppearanceEntry({ field, editField, translate }),
    ...MaxHeightEntry({ field, editField }),
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'appearance',
    label: translate('Appearance'),
    entries,
  };
}
