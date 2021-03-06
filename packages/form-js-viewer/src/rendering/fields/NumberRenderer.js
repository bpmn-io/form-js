import Description from './Description';
import Errors from './Errors';
import Label from './Label';

export default function Number(props) {
  const {
    dataPath,
    disabled,
    errors = [],
    field,
    value
  } = props;

  const onChange = ({ target }) => {
    props.onChange({
      dataPath,
      value: target.value
    });
  };

  return <div class="fjs-form-field">
    <Label label={ field.label } required={ field.validate && field.validate.required } />
    <input
      class="fjs-input"
      type="number"
      disabled={ disabled }
      value={ value }
      onInput={ onChange } />
    <Description description={ field.description } />
    <Errors errors={ errors } />
  </div>;
}

Number.create = function(options = {}) {
  return {
    label : 'Number',
    type: 'number',
    ...options
  };
};