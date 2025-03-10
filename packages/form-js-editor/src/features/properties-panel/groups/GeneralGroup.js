import {
  ActionEntry,
  AltTextEntry,
  DescriptionEntry,
  DefaultValueEntry,
  DisabledEntry,
  IdEntry,
  IFrameUrlEntry,
  IFrameHeightEntry,
  ImageSourceEntry,
  KeyEntry,
  PathEntry,
  RepeatableEntry,
  LabelEntry,
  ReadonlyEntry,
  SelectEntries,
  TextEntry,
  HtmlEntry,
  HeightEntry,
  NumberEntries,
  ExpressionFieldEntries,
  DateTimeEntry,
  TableDataSourceEntry,
  PaginationEntry,
  RowCountEntry,
  VersionTagEntry,
  AcceptEntry,
  MultipleEntry,
  DocumentsDataSourceEntry,
} from '../entries';

export function GeneralGroup(field, editField, getService) {
  const entries = [
    ...IdEntry({ field, editField }),
    ...VersionTagEntry({ field, editField }),
    ...LabelEntry({ field, editField }),
    ...DescriptionEntry({ field, editField }),
    ...KeyEntry({ field, editField, getService }),
    ...PathEntry({ field, editField, getService }),
    ...RepeatableEntry({ field, editField, getService }),
    ...DefaultValueEntry({ field, editField }),
    ...ActionEntry({ field, editField }),
    ...DateTimeEntry({ field, editField }),
    ...TextEntry({ field, editField, getService }),
    ...HtmlEntry({ field, editField, getService }),
    ...IFrameUrlEntry({ field, editField }),
    ...IFrameHeightEntry({ field, editField }),
    ...HeightEntry({ field, editField }),
    ...NumberEntries({ field, editField }),
    ...ExpressionFieldEntries({ field, editField }),
    ...ImageSourceEntry({ field, editField }),
    ...AltTextEntry({ field, editField }),
    ...SelectEntries({ field, editField }),
    ...AcceptEntry({ field, editField }),
    ...MultipleEntry({ field, editField }),
    ...DisabledEntry({ field, editField }),
    ...ReadonlyEntry({ field, editField }),
    ...TableDataSourceEntry({ field, editField }),
    ...PaginationEntry({ field, editField }),
    ...RowCountEntry({ field, editField }),
    ...DocumentsDataSourceEntry({ field, editField }),
  ];

  if (entries.length === 0) {
    return null;
  }

  return {
    id: 'general',
    label: 'General',
    entries,
  };
}
