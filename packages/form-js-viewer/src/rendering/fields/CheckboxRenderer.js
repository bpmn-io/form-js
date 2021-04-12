import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import { prefixId } from './Util';

import { generateIdForType } from '../../util';

const type = 'checkbox';

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

  return <div class={ formFieldClasses(errors, type) }>
    <Label
      id={ prefixId(id) }
      label={ label }
      required={ required } />
    <input
      checked={ value }
      class="fjs-input"
      disabled={ disabled }
      id={ prefixId(id) }
      type="checkbox"
      onChange={ onChange } />
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

CheckboxRenderer.create = function(options = {}) {
  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: this.label,
    type,
    ...options
  };
};

CheckboxRenderer.type = type;

CheckboxRenderer.label = 'Checkbox';