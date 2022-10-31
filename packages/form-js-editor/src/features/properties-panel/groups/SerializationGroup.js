import {
  NumberSerializationEntry
} from '../entries';


export default function SerializationGroup(field, editField) {

  const entries = [
    ...NumberSerializationEntry({ field, editField })
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