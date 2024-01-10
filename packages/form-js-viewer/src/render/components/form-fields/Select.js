import { Description } from '../Description';
import { Errors } from '../Errors';
import { Label } from '../Label';
import { SearchableSelect } from './parts/SearchableSelect';
import { SimpleSelect } from './parts/SimpleSelect';

import { sanitizeSingleSelectValue } from '../util/sanitizerUtil';
import { createEmptyOptions } from '../util/optionsUtil';
import { formFieldClasses } from '../Util';

const type = 'select';

export function Select(props) {
  const {
    disabled,
    errors = [],
    errorMessageId,
    domId,
    onBlur,
    onFocus,
    field,
    onChange,
    readonly,
    value
  } = props;

  const {
    description,
    label,
    searchable = false,
    validate = {}
  } = field;

  const { required } = validate;

  const selectProps = {
    domId,
    disabled,
    errors,
    onBlur,
    onFocus,
    field,
    value,
    onChange,
    readonly,
    'aria-describedby': errorMessageId,
  };

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
      id={ domId }
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
  create: createEmptyOptions
};
