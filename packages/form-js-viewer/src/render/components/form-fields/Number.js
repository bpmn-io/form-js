import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';

import { generateIdForType } from '../../../util';

const type = 'number';

export default function Number(props) {
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
    const parsedValue = parseInt(target.value, 10);

    props.onChange({
      field,
      value: isNaN(parsedValue) ? undefined : parsedValue
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
      type="number"
      value={ value } />
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Number.create = function(options = {}) {
  const _id = generateIdForType(type);

  return {
    _id,
    key: _id,
    label: this.label,
    type,
    ...options
  };
};

Number.type = type;

Number.label = 'Number';