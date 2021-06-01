import { Select } from '../components';

export default function ActionEntry(props) {
  const {
    editField,
    field
  } = props;

  const onChange = (value) => {
    editField(field, 'action', value);
  };

  const value = field.action;

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
    <div class="fjs-properties-panel-entry">
      <Select id="action" label="Action" options={ options } onChange={ onChange } value={ value } />
    </div>
  );
}