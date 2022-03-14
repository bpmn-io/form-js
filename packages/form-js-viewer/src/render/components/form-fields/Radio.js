import { useContext } from 'preact/hooks';

import { FormContext } from '../../context';
import useService from '../../hooks/useService';
import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';
import { formFieldClasses, prefixId } from '../Util';

const type = 'radio';
const placeholderForEditor = [{ label: 'Placeholder 1', value: '' }, { label: 'Placeholder 2', value: '' }];

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
    values,
    optionsFromKey,
    optionsKey
  } = field;

  const { required } = validate;

  const onChange = (v) => {
    props.onChange({
      field,
      value: v
    });
  };

  let _values = values;
  const form = useService('form');

  if (optionsFromKey && optionsKey) {
    const options = form?._getState()?.initialData && form._getState().initialData[optionsKey];
    _values = options ? options : placeholderForEditor;
  }

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      label={ label }
      required={ required } />
    {
      (_values.map((v, index) => {
        return (
          <Label
            id={ prefixId(`${id}-${index}`, formId) }
            key={ `${id}-${index}` }
            label={ v.label }
            required={ false }>
            <input
              checked={ v.value === value }
              class="fjs-input"
              disabled={ disabled }
              id={ prefixId(`${id}-${index}`, formId) }
              type="radio"
              onClick={ () => onChange(v.value) } />
          </Label>
        );
      }
      ))
    }
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Radio.create = function(options = {}) {
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

Radio.type = type;
Radio.label = 'Radio';
Radio.keyed = true;
Radio.emptyValue = null;