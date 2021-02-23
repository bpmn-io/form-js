import Errors from './Errors';
import Description from './Description';
import Label from './Label';

export default function TextfieldRenderer(props) {
  const onInput = ({ target }) => props.onChange({
    dataPath: props.dataPath,
    value: target.value.length ? target.value : undefined
  });

  return (
    <div class="form-field">
      <Label field={ props.field } for={ props.id } />
      <input
        class="form-field-input"
        id={ props.id }
        type="text"
        value={ props.value === undefined ? '' : props.value }
        disabled={ props.disabled || props.field.disabled }
        onInput={ onInput }
        onBlur={ onInput }
      />
      <Errors errors={ props.errors } />
      <Description field={ props.field } />
    </div>
  );
}

TextfieldRenderer.create = function(options = {}) {
  return {
    label: 'Text Field',
    type: 'textfield',
    ...options
  };
};