import Description from './Description';
import Errors from './Errors';
import Label from './Label';

export default function Checkbox(props) {
  const {
    dataPath,
    disabled,
    errors = [],
    field,
    value = false
  } = props;

  const onChange = ({ target }) => {
    props.onChange({
      dataPath,
      value: target.checked
    });
  };

  return <div class="fjs-form-field">
    <Label label={ field.label } required={ field.validate && field.validate.required } />
    <input
      class="fjs-input"
      type="checkbox"
      checked={ value }
      onChange={ onChange }
      disabled={ disabled } />
    <Description description={ field.description } />
    <Errors errors={ errors } />
  </div>;
}

Checkbox.create = function(options = {}) {
  return {
    label: 'Checkbox',
    type: 'checkbox',
    ...options
  };
};