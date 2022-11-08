import { useContext } from 'preact/hooks';
import useValuesAsync, { LOAD_STATES } from '../../hooks/useValuesAsync';

import classNames from 'classnames';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import { sanitizeSingleSelectValue } from '../util/sanitizerUtil';
import {
  formFieldClasses,
  prefixId
} from '../Util';

const type = 'radio';


export default function Radio(props) {
  const {
    disabled,
    errors = [],
    field,
    label,
    readonly,
    value
  } = props;

  const {
    description,
    id,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = (v) => {
    props.onChange({
      field,
      value: v
    });
  };

  const {
    state: loadState,
    values: options
  } = useValuesAsync(field);

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      label={ label }
      required={ required } />
    {
      loadState == LOAD_STATES.LOADED && options.map((option, index) => {
        return (
          <Label
            id={ prefixId(`${ id }-${ index }`, formId) }
            key={ `${ id }-${ index }` }
            label={ option.label }
            required={ false }>
            <input
              checked={ option.value === value }
              class={ classNames('fjs-input', { readonly }) }
              disabled={ disabled }
              id={ prefixId(`${ id }-${ index }`, formId) }

              // todo(pinussilvestrus): a11y concerns?
              tabIndex={ readonly ? -1 : 0 }
              type="radio"
              onClick={ () => onChange(option.value) } />
          </Label>
        );
      })
    }
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Radio.create = function(options = {}) {

  if (options.valuesKey) return options;

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
Radio.sanitizeValue = sanitizeSingleSelectValue;