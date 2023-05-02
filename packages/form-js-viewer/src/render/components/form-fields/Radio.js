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
    readonly,
    value
  } = props;

  const {
    description,
    id,
    label,
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
  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  return <div class={ formFieldClasses(type, { errors, disabled, readonly }) }>
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
            class={ classNames({ 'fjs-checked': option.value === value }) }
            required={ false }>
            <input
              checked={ option.value === value }
              class="fjs-input"
              disabled={ disabled }
              readOnly={ readonly }
              id={ prefixId(`${ id }-${ index }`, formId) }
              type="radio"
              onClick={ () => onChange(option.value) }
              aria-describedby={ errorMessageId } />
          </Label>
        );
      })
    }
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Radio.config = {
  type,
  keyed: true,
  label: 'Radio',
  group: 'selection',
  emptyValue: null,
  sanitizeValue: sanitizeSingleSelectValue,
  create: (options = {}) => {
    const defaults = {};

    // provide default values if valuesKey isn't set
    if (!options.valuesKey) {
      defaults.values = [
        {
          label: 'Value',
          value: 'value'
        }
      ];
    }

    return {
      ...defaults,
      ...options
    };
  }
};
