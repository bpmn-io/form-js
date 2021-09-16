import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'select';

export default function Select(props) {
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

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.value === '' ? undefined : target.value
    });
  };

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(id) }
      label={ label }
      required={ required } />
    <select
      class="fjs-select"
      disabled={ disabled }
      id={ prefixId(id) }
      onChange={ onChange }
      value={ value || '' }>
      <option value=""></option>
      {
        values.map((v) => {
          return (
            <option
              key={ v.value }
              value={ v.value }>
              { v.label }
            </option>
          );
        })
      }
    </select>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Select.create = function(options = {}) {

  return {
    values: [
      {
        label: 'Value',
        value: 'value'
      }
    ],
    ...options
  };
};

Select.type = type;
Select.label = 'Select';
Select.keyed = true;