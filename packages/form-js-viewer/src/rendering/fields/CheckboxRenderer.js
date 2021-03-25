import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import {
  generateIdForType
} from '../../util';


export default function CheckboxRenderer(props) {
  const {
    disabled,
    errors = [],
    field,
    path,
    value = false
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
      value: target.checked
    });
  };

  return <div class={ formFieldClasses(errors) }>
    <Label
      id={ id }
      label={ label }
      required={ required } />
    <input
      checked={ value }
      class="fjs-input"
      disabled={ disabled }
      name={ id }
      type="checkbox"
      onChange={ onChange } />
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

CheckboxRenderer.create = function(options = {}) {
  const type = 'checkbox';

  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: this.label,
    type,
    ...options
  };
};

CheckboxRenderer.type = 'checkbox';

CheckboxRenderer.label = 'Checkbox';