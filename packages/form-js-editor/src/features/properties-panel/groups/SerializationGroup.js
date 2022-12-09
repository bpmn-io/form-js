import {
  NumberSerializationEntry,
  DateTimeSerializationEntry
} from '../entries';


export default function SerializationGroup(field, editField) {

  const entries = [
    ...NumberSerializationEntry({ field, editField }),
    ...DateTimeSerializationEntry({ field, editField })
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'serialization',
    label: 'Serialization',
    entries
  };
}