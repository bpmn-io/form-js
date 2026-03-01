import { NumberSerializationEntry, DateTimeFormatEntry, OmitFromSubmitEntry } from '../entries';

export function SerializationGroup(field, editField) {
  const entries = [
    ...NumberSerializationEntry({ field, editField }),
    ...DateTimeFormatEntry({ field, editField }),
    ...OmitFromSubmitEntry({ field, editField }),
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'serialization',
    label: 'Serialization',
    entries,
  };
}
