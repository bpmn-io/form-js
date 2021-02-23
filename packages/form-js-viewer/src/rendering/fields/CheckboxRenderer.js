import Label from './Label';
import Errors from './Errors';
import Description from './Description';

export default function CheckboxRenderer(props) {
  const onChange = ({ target }) => {
    props.onChange({
      dataPath: props.dataPath,
      value: target.checked
    });
  };

  return (
    <div class="form-field">
      <Label field={ props.field } for={ props.id }>
        <input
          class="form-field-input"
          id={ props.id }
          type="checkbox"
          checked={ props.value }
          disabled={ props.disabled || props.field.disabled }
          onChange={ onChange }
        />
      </Label>
      <Errors errors={ props.errors } />
      <Description field={ props.field } />
    </div>
  );
}

CheckboxRenderer.create = function(options = {}) {
  return {
    label: 'Checkbox',
    type: 'checkbox',
    ...options
  };
};