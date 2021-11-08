import { isUndefined } from 'min-dash';

import { CheckboxInputEntry, TextInputEntry } from '../../components';
import useService from '../../../../hooks/useService';


export default function RequireCheckBox(props) {
  const { onChange, value, field, editField } = props;
  console.log('props',props);
  const formFieldRegistry = useService('formFieldRegistry');
  const validate = (value) => {
    if (isUndefined(value) || !value.length) {
      return 'Must not be empty.';
    }

    const assigned = formFieldRegistry._keys.assigned(value);

    if (assigned && assigned !== field) {
      return 'Must be unique.';
    }

    return null;
  };
  const handleRequire = (reqValue)=>{

    // empty default value
    if (!reqValue) {
      editField(field, [ 'defaultValue' ], undefined);
    }
    onChange('required')(reqValue);
  };
  return (
    <div class="fjs-editor-container">
      <CheckboxInputEntry
        id="required"
        label="Required"
        onChange={ handleRequire }
        value={ value } />
      {value ? (
        <TextInputEntry
          editField={ editField }
          field={ field }
          id="defaultValue"
          label="DefaultValue"
          path={ [ 'defaultValue' ] }
          value={ field.key }
          validate={ validate }
          onChange={ onChange('defaultValue') }
        />) : null}
    </div>

  );
}