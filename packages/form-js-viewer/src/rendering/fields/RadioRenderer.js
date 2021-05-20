import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import { prefixId } from './Util';

import { generateIdForType } from '../../util';

const type = 'radio';

export default function RadioRenderer(props) {
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
    validate = {},
    values
  } = field;

  const { required } = validate;

  const onChange = (v) => {
    props.onChange({
      path,
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
            id={ prefixId(`${id}-${index}`) }
            label={ v.label }
            required={ false }>
            <input
              checked={ v.value === value }
              class="fjs-input"
              disabled={ disabled }
              id={ prefixId(`${id}-${index}`) }
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

RadioRenderer.create = function(options = {}) {
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

RadioRenderer.type = type;

RadioRenderer.label = 'Radio';