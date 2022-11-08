import { useContext } from 'preact/hooks';
import useOptionsAsync, { LOAD_STATES } from '../../hooks/useValuesAsync';

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

const type = 'select';

export default function Select(props) {
  const {
    disabled,
    errors = [],
    field,
    label,
    value,
    readonly
  } = props;

  const {
    description,
    id,
    validate = {}
  } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: target.value === '' ? null : target.value
    });
  };

  const {
    state: loadState,
    values: options
  } = useOptionsAsync(field);

  const { formId } = useContext(FormContext);

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      id={ prefixId(id, formId) }
      label={ label }
      required={ required } />
    <select
      class={ classNames('fjs-select', { readonly }) }
      disabled={ disabled }
      id={ prefixId(id, formId) }
      onChange={ onChange }

      // todo(pinussilvestrus): a11y concerns?
      tabIndex={ readonly ? -1 : 0 }
      value={ value || '' }>
      <option value=""></option>
      {
        loadState == LOAD_STATES.LOADED && options.map((option, index) => {
          return (
            <option
              key={ `${ id }-${ index }` }
              value={ option.value }>
              { option.label }
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

Select.type = type;
Select.label = 'Select';
Select.keyed = true;
Select.emptyValue = null;
Select.sanitizeValue = sanitizeSingleSelectValue;