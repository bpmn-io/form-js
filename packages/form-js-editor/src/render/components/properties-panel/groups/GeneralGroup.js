import { Group } from '../components';

import {
  ActionEntry,
  ColumnsEntry,
  DescriptionEntry,
  DisabledEntry,
  IdEntry,
  KeyEntry,
  LabelEntry,
  TextEntry
} from '../entries';

import { INPUTS } from '../Util';

export default function GeneralGroup(field, editField) {
  const { type } = field;

  const entries = [];

  if (type === 'default') {
    entries.push(<IdEntry editField={ editField } field={ field } />);
  }

  if (INPUTS.includes(type) || type === 'button') {
    entries.push(<LabelEntry editField={ editField } field={ field } />);
  }

  if (INPUTS.includes(type)) {
    entries.push(<DescriptionEntry editField={ editField } field={ field } />);
  }

  if (INPUTS.includes(type)) {
    entries.push(<KeyEntry editField={ editField } field={ field } />);
  }

  if (type === 'button') {
    entries.push(<ActionEntry editField={ editField } field={ field } />);
  }

  if (type === 'columns') {
    entries.push(<ColumnsEntry editField={ editField } field={ field } />);
  }

  if (type === 'text') {
    entries.push(<TextEntry editField={ editField } field={ field } />);
  }

  if (INPUTS.includes(type)) {
    entries.push(<DisabledEntry editField={ editField } field={ field } />);
  }

  return (
    <Group label="General">
      {
        entries.length ? entries : null
      }
    </Group>
  );
}