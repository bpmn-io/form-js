import { CheckboxInput, TextInput } from '../components';

export default function OptionsFromKeyEntry(props) {
  const {
    editField,
    field
  } = props;


  const onInput = (value) => {
    if (editField) {
      editField(field, 'optionsKey', value);
    }

  };

  const onChange = (value) => {
    if (editField) {
      editField(field, ['optionsFromKey'], value);
      if (value) {
        editField(field, ['values'], []);
      } else {
        editField(field, ['optionsKey'], '');
      }
    }
  };

  const validate = (value) => {
    if (field.optionsFromKey && value === '') {
      return 'Please enter key to use for options';
    }
  };



  return (
    <div class="fjs-properties-panel-entry">
      <CheckboxInput id="optionsFromKey" label="Option Values From Key" onChange={ onChange } value={ field.optionsFromKey } />
      {field.optionsFromKey ? <TextInput id="optionsKey" label="Options Key" onInput={ onInput } validate={ validate } value={ field.optionsKey } /> : null}
    </div>
  );

}