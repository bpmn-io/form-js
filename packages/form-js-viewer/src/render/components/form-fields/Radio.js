import { useRef } from 'preact/hooks';
import isEqual from 'lodash/isEqual';
import { useOptionsAsync, LOAD_STATES } from '../../hooks/useOptionsAsync';
import { useCleanupSingleSelectValue } from '../../hooks/useCleanupSingleSelectValue';
import classNames from 'classnames';

import { Description } from '../Description';
import { Errors } from '../Errors';
import { Label } from '../Label';

import { sanitizeSingleSelectValue } from '../util/sanitizerUtil';

import { createEmptyOptions } from '../util/optionsUtil';

import { formFieldClasses } from '../Util';

const type = 'radio';

export function Radio(props) {
  const { disabled, errors = [], domId, onBlur, onFocus, field, readonly, value } = props;

  const { description, label, validate = {} } = field;

  /** @type {import("preact").RefObject<HTMLDivElement>} */
  const outerDivRef = useRef();

  const { required } = validate;

  const onChange = (v) => {
    props.onChange({
      value: v,
    });
  };

  const onRadioBlur = (e) => {
    if (outerDivRef.current.contains(e.relatedTarget)) {
      return;
    }

    onBlur && onBlur();
  };

  const onRadioFocus = (e) => {
    if (outerDivRef.current.contains(e.relatedTarget)) {
      return;
    }

    onFocus && onFocus();
  };

  const { loadState, options } = useOptionsAsync(field);

  useCleanupSingleSelectValue({
    field,
    loadState,
    options,
    value,
    onChange: props.onChange,
  });

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;

  return (
    <div class={formFieldClasses(type, { errors, disabled, readonly })} ref={outerDivRef}>
      <Label label={label} required={required} />
      {loadState == LOAD_STATES.LOADED &&
        options.map((option, index) => {
          const itemDomId = `${domId}-${index}`;
          const isChecked = isEqual(option.value, value);

          return (
            <div
              className={classNames('fjs-inline-label', {
                'fjs-checked': isChecked,
              })}
              key={option.value}>
              <input
                checked={isChecked}
                class="fjs-input"
                disabled={disabled}
                readOnly={readonly}
                name={domId}
                id={itemDomId}
                type="radio"
                onClick={() => onChange(option.value)}
                onBlur={onRadioBlur}
                onFocus={onRadioFocus}
                aria-describedby={[descriptionId, errorMessageId].join(' ')}
                required={required}
                aria-invalid={errors.length > 0}
              />
              <Label
                htmlFor={itemDomId}
                label={option.label}
                class={classNames({ 'fjs-checked': isChecked })}
                required={false}
              />
            </div>
          );
        })}
      <Description id={descriptionId} description={description} />
      <Errors id={errorMessageId} errors={errors} />
    </div>
  );
}

Radio.config = {
  type,
  keyed: true,
  name: 'Radio group',
  group: 'selection',
  emptyValue: null,
  sanitizeValue: sanitizeSingleSelectValue,
  create: (options = {}) => ({
    label: 'Radio group',
    ...createEmptyOptions(options),
  }),
};
