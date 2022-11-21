import {
  ActionEntry,
  AltTextEntry,
  ColumnsEntry,
  DescriptionEntry,
  DefaultValueEntry,
  DisabledEntry,
  IdEntry,
  ImageSourceEntry,
  KeyEntry,
  LabelEntry,
  TextEntry,
  NumberEntries,
} from '../entries';


export default function GeneralGroup(field, editField) {

  const entries = [
    ...IdEntry({ field, editField }),
    ...LabelEntry({ field, editField }),
    ...DescriptionEntry({ field, editField }),
    ...KeyEntry({ field, editField }),
    ...DefaultValueEntry({ field, editField }),
    ...ActionEntry({ field, editField }),
    ...ColumnsEntry({ field, editField }),
    ...TextEntry({ field, editField }),
    ...NumberEntries({ field, editField }),
    ...ImageSourceEntry({ field, editField }),
    ...AltTextEntry({ field, editField }),
    ...DisabledEntry({ field, editField })
  ];

  return {
    id: 'general',
    label: 'General',
    entries
  };
}