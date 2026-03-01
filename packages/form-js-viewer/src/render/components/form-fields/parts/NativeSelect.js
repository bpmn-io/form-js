import { useCallback, useMemo } from 'preact/hooks';
import { useOptionsAsync, LOAD_STATES } from '../../../hooks/useOptionsAsync';
import { useCleanupSingleSelectValue } from '../../../hooks/useCleanupSingleSelectValue';

import classNames from 'classnames';

/**
 * A native `<select>` element for touch / coarse-pointer devices.
 *
 * It receives the same props contract as SimpleSelect / SearchableSelect so
 * that Select.js can swap between them transparently.
 */
export function NativeSelect(props) {
  const {
    domId,
    disabled,
    errors,
    onBlur,
    onFocus,
    field,
    readonly,
    value,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
  } = props;

  const { loadState, options } = useOptionsAsync(field);
  useCleanupSingleSelectValue({
    field,
    loadState,
    options,
    value,
    onChange: props.onChange,
  });

  const safeValue = useMemo(() => {
    if (value === null || value === undefined) return '';
    return String(value);
  }, [value]);

  const onChange = useCallback(
    (e) => {
      const selected = e.target.value;
      props.onChange({ value: selected === '' ? null : selected });
    },
    [props],
  );

  const ready = loadState === LOAD_STATES.LOADED;

  return (
    <select
      class={classNames('fjs-select', { hasErrors: errors.length })}
      id={domId}
      disabled={disabled || !ready}
      readOnly={readonly}
      value={safeValue}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={errors.length > 0}>
      <option value="" disabled hidden>
        Select
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
