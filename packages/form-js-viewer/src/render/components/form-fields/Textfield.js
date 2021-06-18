import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';

import { generateIdForType } from '../../../util';

const type = 'textfield';

export default function Textfield(props) {
  const {
    disabled,
    errors = [],
    field,
    value = ''
  } = props;

  const {
    description,
    _id,
    label,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.value
    });
  };

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(_id) }
      label={ label }
      required={ required } />
    <input
      class="fjs-input"
      disabled={ disabled }
      id={ prefixId(_id) }
      onInput={ onChange }
      type="text"
      value={ value } />
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Textfield.create = function(options = {}) {
  const _id = generateIdForType(type);

  return {
    _id,
    key: _id,
    label: this.label,
    type,
    ...options
  };
};

Textfield.type = type;

Textfield.label = 'Text Field';