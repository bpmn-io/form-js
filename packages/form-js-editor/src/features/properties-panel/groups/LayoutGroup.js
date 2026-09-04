import { ColumnsEntry } from '../entries';

export function LayoutGroup(field, editField, getService) {
  const { type } = field;

  const translate = getService('translate');

  if (type === 'default') {
    return null;
  }

  const entries = [...ColumnsEntry({ field, editField })];

  if (entries.length === 0) {
    return null;
  }

  return {
    id: 'layout',
    label: translate('Layout'),
    entries,
  };
}
