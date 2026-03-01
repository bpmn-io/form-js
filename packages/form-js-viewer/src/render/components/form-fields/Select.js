import { Description } from '../Description';
import { Errors } from '../Errors';
import { Label } from '../Label';
import { NativeSelect } from './parts/NativeSelect';
import { SearchableSelect } from './parts/SearchableSelect';
import { SimpleSelect } from './parts/SimpleSelect';

import { sanitizeSingleSelectValue } from '../util/sanitizerUtil';
import { createEmptyOptions } from '../util/optionsUtil';
import { formFieldClasses } from '../Util';

/**
 * True when the primary pointer is fine (mouse / trackpad).
 * Falls back to true when matchMedia is unavailable (e.g. SSR or jsdom).
 */
const HAS_FINE_POINTER =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(pointer:fine)').matches
    : true;

const type = 'select';

export function Select(props) {
  const { disabled, errors = [], domId, onBlur, onFocus, field, onChange, readonly, value } = props;

  const { description, label, searchable = false, validate = {} } = field;

  const { required } = validate;

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;
  const labelId = `${domId}-label`;

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
    required,
    'aria-invalid': errors.length > 0,
    'aria-describedby': [descriptionId, errorMessageId].join(' '),
    'aria-labelledby': labelId,
  };

  return (
    <div
      class={formFieldClasses(type, { errors, disabled, readonly })}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
        }
      }}>
      <Label id={labelId} htmlFor={domId} label={label} required={required} />
      {!HAS_FINE_POINTER ? (
        <NativeSelect {...selectProps} />
      ) : searchable ? (
        <SearchableSelect {...selectProps} />
      ) : (
        <SimpleSelect {...selectProps} />
      )}
      <Description id={descriptionId} description={description} />
      <Errors id={errorMessageId} errors={errors} />
    </div>
  );
}

Select.config = {
  type,
  keyed: true,
  name: 'Select',
  group: 'selection',
  emptyValue: null,
  sanitizeValue: sanitizeSingleSelectValue,
  create: (options = {}) => ({
    label: 'Select',
    ...createEmptyOptions(options),
  }),
};
