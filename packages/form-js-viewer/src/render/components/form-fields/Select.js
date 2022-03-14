import { useContext } from 'preact/hooks';

import { FormContext } from '../../context';
import useService from '../../hooks/useService';
import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';
import { formFieldClasses, prefixId } from '../Util';

const type = 'select';

export default function Select(props) {
  const {
    disabled,
    errors = [],
    field,
    value,
  } = props;

  const {
    description,
    id,
    label,
    validate = {},
    values,
    optionsFromKey,
    optionsKey
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.value === '' ? null : target.value
    });
  };
  let _values = values;
  const form = useService('form');

  if (optionsFromKey && optionsKey) {
    const options = form?._getState()?.initialData && form._getState().initialData[optionsKey];
    _values = options ? options : [];
  }

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <select
      class="fjs-select"
      disabled={ disabled }
      id={ prefixId(id, formId) }
      onChange={ onChange }
      value={ value || '' }>
      <option value=""></option>
      {
        _values.map((v, index) => {
          return (
            <option
              key={ `${ id }-${ index }` }
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
Select.emptyValue = null;