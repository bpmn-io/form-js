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

  const selectProps = useMemo(() => ({
    id,
    disabled,
    errors,
    field,
    value,
    onChange
  }), [ disabled, errors, field, id, value, onChange ]);

  return <div
    class={ formFieldClasses(type, { errors, disabled }) }
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
    <Errors errors={ errors } />
  </div>;
}

Select.create = (options = {}) => {

  const defaults = { };

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
};

Select.type = type;
Select.label = 'Select';
Select.keyed = true;
Select.emptyValue = null;
Select.sanitizeValue = sanitizeSingleSelectValue;
Select.group = 'selection';