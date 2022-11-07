import {
  AltTextEntry,
  SourceEntry
} from '../entries';


export default function ImageGroup(field, editField) {

  const {
    type
  } = field;

  if (type !== 'image') {
    return null;
  }

  const entries = [
    ...SourceEntry({ field, editField }),
    ...AltTextEntry({ field, editField }),
  ];

  return {
    id: 'image',
    label: 'Image',
    entries
  };
}