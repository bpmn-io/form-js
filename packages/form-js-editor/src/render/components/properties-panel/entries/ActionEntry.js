import { SelectEntry } from '../components';

export default function ActionEntry(props) {
  const {
    editField,
    field
  } = props;

  const options = [
    {
      label: 'Submit',
      value: 'submit'
    },
    {
      label: 'Reset',
      value: 'reset'
    }
  ];

  return (
    <SelectEntry
      editField={ editField }
      field={ field }
      id="action"
      label="Action"
      options={ options }
      path={ [ 'action' ] } />
  );
}