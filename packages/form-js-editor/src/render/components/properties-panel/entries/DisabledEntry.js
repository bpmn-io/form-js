import { CheckboxInputEntry } from '../components';

export default function DisabledEntry(props) {
  const {
    editField,
    field
  } = props;

  const onChange = (value) => {
    editField(field, 'disabled', value);
  };

  return <CheckboxInputEntry
    id="disabled"
    field={ field }
    label="Disabled"
    path={ [ 'disabled' ] }
    onChange={ onChange } />;
}