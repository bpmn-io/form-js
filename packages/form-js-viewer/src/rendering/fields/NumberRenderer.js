import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import {
  generateIdForType
} from '../../util';


export default function NumberRenderer(props) {
  const {
    disabled,
    errors = [],
    field,
    path,
    value
  } = props;

  const {
    description,
    id,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      path,
      value: target.value ? parseInt(target.value, 10) : undefined
    });
  };

  return <div class={ formFieldClasses(errors) }>
    <Label
      id={ id }
      label={ label }
      required={ required } />
    <input
      class="fjs-input"
      disabled={ disabled }
      name={ id }
      onInput={ onChange }
      type="number"
      value={ value } />
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

NumberRenderer.create = function(options = {}) {
  const type = 'number';

  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: this.label,
    type,
    ...options
  };
};

NumberRenderer.type = 'number';

NumberRenderer.label = 'Number';