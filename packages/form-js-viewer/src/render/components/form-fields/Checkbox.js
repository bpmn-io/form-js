import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';

import { generateIdForType } from '../../../util';

const type = 'checkbox';

export default function Checkbox(props) {
  const {
    disabled,
    errors = [],
    field,
    value = false
  } = props;

  const {
    description,
    _id,
    label
  } = field;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.checked
    });
  };

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(_id) }
      label={ label }
      required={ false }>
      <input
        checked={ value }
        class="fjs-input"
        disabled={ disabled }
        id={ prefixId(_id) }
        type="checkbox"
        onChange={ onChange } />
    </Label>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Checkbox.create = function(options = {}) {
  const _id = generateIdForType(type);

  return {
    _id,
    key: _id,
    label: this.label,
    type,
    ...options
  };
};

Checkbox.type = type;

Checkbox.label = 'Checkbox';