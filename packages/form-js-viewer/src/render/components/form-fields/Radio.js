import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';

import { generateIdForType } from '../../../util';

const type = 'radio';

export default function Radio(props) {
  const {
    disabled,
    errors = [],
    field,
    value
  } = props;

  const {
    description,
    id,
    label,
    validate = {},
    values
  } = field;

  const { required } = validate;

  const onChange = (v) => {
    props.onChange({
      field,
      value: v === value ? undefined : v
    });
  };

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      label={ label }
      required={ required } />
    {
      values.map((v, index) => {
        return (
          <Label
            id={ prefixId(`${ id }-${ index }`) }
            key={ v.value }
            label={ v.label }
            required={ false }>
            <input
              checked={ v.value === value }
              class="fjs-input"
              disabled={ disabled }
              id={ prefixId(`${ id }-${ index }`) }
              type="radio"
              onClick={ () => onChange(v.value) } />
          </Label>
        );
      })
    }
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Radio.create = function(options = {}) {
  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: this.label,
    type,
    values: [
      {
        label: 'Value',
        value: 'value'
      }
    ],
    ...options
  };
};

Radio.type = type;

Radio.label = 'Radio';