import {
  DateTimeFormatEntry
} from '../entries';


export default function FormatGroup(field, editField) {

  const entries = [
    ...DateTimeFormatEntry({ field, editField })
  ];

  if (!entries.length) {
    return null;
  }

  return {
    id: 'format',
    label: 'Format',
    entries
  };
}