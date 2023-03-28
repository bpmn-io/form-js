import { ColumnsEntry } from '../entries';

export default function LayoutGroup(field, editField) {
  const { type } = field;

  if (type === 'default') {
    return null;
  }

  const entries = [
    ...ColumnsEntry({ field, editField })
  ];

  if (entries.length === 0) {
    return null;
  }

  return {
    id: 'layout',
    label: 'Layout',
    entries
  };
}