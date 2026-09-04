import { ConditionEntry } from '../entries';

export function ConditionGroup(field, editField, getService) {
  const { type } = field;

  if (type === 'default') {
    return null;
  }

  const entries = [...ConditionEntry({ field, editField })];

  const translate = getService('translate');

  return {
    id: 'condition',
    label: translate('Condition'),
    entries,
  };
}
