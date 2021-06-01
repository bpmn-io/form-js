import { TextInputEntry } from '../components';

export default function DescriptionEntry(props) {
  const {
    editField,
    field
  } = props;

  return (
    <TextInputEntry
      editField={ editField }
      field={ field }
      id="description"
      label="Field Description"
      path={ [ 'description' ] } />
  );
}