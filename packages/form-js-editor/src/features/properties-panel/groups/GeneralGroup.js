import {
  ActionEntry,
  AltTextEntry,
  DescriptionEntry,
  DefaultValueEntry,
  DisabledEntry,
  IdEntry,
  ImageSourceEntry,
  KeyEntry,
  PathEntry,
  GroupEntries,
  LabelEntry,
  ReadonlyEntry,
  SelectEntries,
  TextEntry,
  SpacerEntry,
  NumberEntries,
  DateTimeEntry
} from '../entries';


export default function GeneralGroup(field, editField, getService) {

  const entries = [
    ...IdEntry({ field, editField }),
    ...LabelEntry({ field, editField }),
    ...DescriptionEntry({ field, editField }),
    ...KeyEntry({ field, editField }),
    ...PathEntry({ field, editField }),
    ...GroupEntries({ field, editField }),
    ...DefaultValueEntry({ field, editField }),
    ...ActionEntry({ field, editField }),
    ...DateTimeEntry({ field, editField }),
    ...TextEntry({ field, editField, getService }),
    ...SpacerEntry({ field, editField }),
    ...NumberEntries({ field, editField }),
    ...ImageSourceEntry({ field, editField }),
    ...AltTextEntry({ field, editField }),
    ...SelectEntries({ field, editField }),
    ...DisabledEntry({ field, editField }),
    ...ReadonlyEntry({ field, editField })
  ];

  return {
    id: 'general',
    label: 'General',
    entries
  };
}