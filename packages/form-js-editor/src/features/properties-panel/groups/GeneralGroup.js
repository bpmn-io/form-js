import {
  ActionEntry,
  ColumnsEntry,
  DescriptionEntry,
  DefaultValueEntry,
  IdEntry,
  KeyEntry,
  LabelEntry,
  TextEntry,
  DateTimeEntry
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
    ...DateTimeEntry({ field, editField }),
    ...TextEntry({ field, editField })
  ];

  return {
    id: 'general',
    label: 'General',
    entries
  };
}