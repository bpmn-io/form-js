import { NumberSerializationEntry, DateTimeFormatEntry } from '../entries';

export function SerializationGroup(field, editField, getService) {
  const entries = [...NumberSerializationEntry({ field, editField }), ...DateTimeFormatEntry({ field, editField })];

  const translate = getService('translate');

  if (!entries.length) {
    return null;
  }

  return {
    id: 'serialization',
    label: translate('Serialization'),
    entries,
  };
}
