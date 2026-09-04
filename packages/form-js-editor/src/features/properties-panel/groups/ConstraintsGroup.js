import { DateTimeConstraintsEntry } from '../entries';

export function ConstraintsGroup(field, editField, getService) {
  const entries = [...DateTimeConstraintsEntry({ field, editField })];

  const translate = getService('translate');

  if (!entries.length) {
    return null;
  }

  return {
    id: 'constraints',
    label: translate('Constraints'),
    entries,
  };
}
