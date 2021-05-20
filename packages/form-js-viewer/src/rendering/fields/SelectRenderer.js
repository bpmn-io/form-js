import Description from './Description';
import Errors from './Errors';
import Label from './Label';

import { formFieldClasses } from './Util';

import { prefixId } from './Util';

import { generateIdForType } from '../../util';

const type = 'select';

export default function SelectRenderer(props) {
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

  const onChange = ({ target }) => {
    props.onChange({
      path,
      value: target.value === '' ? undefined : target.value
    });
  };

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      label={ label }
      required={ required } />
    <select
      class="fjs-select"
      disabled={ disabled }
      id={ prefixId(id) }
      onChange={ onChange }
      value={ value }>
      <option value=""></option>
      {
        values.map((v, index) => {
          return (
            <option
              value={ v.value }>
              {v.label }
            </option>
          );
        })
      }
    </select>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

SelectRenderer.create = function(options = {}) {
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

SelectRenderer.type = type;

SelectRenderer.label = 'Select';