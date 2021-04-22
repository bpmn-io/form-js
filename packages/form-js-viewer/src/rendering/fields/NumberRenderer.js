import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import { prefixId } from './Util';

import { generateIdForType } from '../../util';

const type = 'number';


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

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(id) }
      label={ label }
      required={ required } />
    <input
      class="fjs-input"
      disabled={ disabled }
      id={ prefixId(id) }
      onInput={ onChange }
      type="number"
      value={ value } />
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

NumberRenderer.create = function(options = {}) {
  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: this.label,
    type,
    ...options
  };
};

NumberRenderer.type = type;

NumberRenderer.label = 'Number';