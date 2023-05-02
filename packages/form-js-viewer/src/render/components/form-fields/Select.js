import { useContext, useMemo } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import { sanitizeSingleSelectValue } from '../util/sanitizerUtil';
import {
  formFieldClasses,
  prefixId
} from '../Util';
import SearchableSelect from './parts/SearchableSelect';
import SimpleSelect from './parts/SimpleSelect';

const type = 'select';

export default function Select(props) {
  const {
    disabled,
    errors = [],
    field,
    onChange,
    readonly,
    value
  } = props;

  const {
    description,
    id,
    label,
    searchable = false,
    validate = {}
  } = field;

  const { required } = validate;

  const { formId } = useContext(FormContext);
  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  const selectProps = useMemo(() => ({
    id,
    disabled,
    errors,
    field,
    value,
    onChange,
    readonly,
    'aria-describedby': errorMessageId,
  }), [ disabled, errors, field, id, value, onChange, readonly, errorMessageId ]);

  return <div
    class={ formFieldClasses(type, { errors, disabled, readonly }) }
    onKeyDown={
      (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  >
    <Label
      id={ prefixId(`${id}-search`, formId) }
      label={ label }
      required={ required } />
    { searchable ? <SearchableSelect { ...selectProps } /> : <SimpleSelect { ...selectProps } /> }
    <Description description={ description } />
    <Errors errors={ errors } id={ errorMessageId } />
  </div>;
}

Select.config = {
  type,
  keyed: true,
  label: 'Select',
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
