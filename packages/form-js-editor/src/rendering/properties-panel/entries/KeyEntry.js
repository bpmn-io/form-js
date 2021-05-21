import { TextInputEntry } from '../components';

// TODO: Check whether key unique
export default function KeyEntry(props) {
  const {
    editField,
    field
  } = props;

  return (
    <TextInputEntry
      editField={ editField }
      field={ field }
      id="key"
      label="Key"
      description="Maps to a process variable."
      path={ [ 'key' ] } />
  );
}