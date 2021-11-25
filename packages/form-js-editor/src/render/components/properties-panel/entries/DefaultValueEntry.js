import { TextInputEntry } from '../components';


export default function RequireCheckBox(props) {
  const { field, editField } = props;

  return (
    <TextInputEntry
      editField={ editField }
      field={ field }
      id="defaultValue"
      label="DefaultValue"
      path={ [ 'defaultValue' ] }
      value={ field.key }
    />
  );
}