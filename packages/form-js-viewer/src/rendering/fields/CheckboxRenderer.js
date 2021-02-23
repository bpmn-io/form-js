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
    <div class="fjs-form-field">
      <Label field={ props.field } for={ props.id }>
        <input
          class="fjs-input"
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