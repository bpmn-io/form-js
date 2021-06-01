import { TextInputEntry } from '../components';

export default function LabelEntry(props) {
  const {
    editField,
    field
  } = props;

  return (
    <TextInputEntry
      editField={ editField }
      field={ field }
      id="label"
      label="Field Label"
      path={ [ 'label' ] } />
  );
}