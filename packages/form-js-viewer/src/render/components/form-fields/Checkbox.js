import { Description } from '../Description';
import { Errors } from '../Errors';
import { Label } from '../Label';
import { useService } from '../../hooks';

import { formFieldClasses } from '../Util';

import classNames from 'classnames';

const type = 'checkbox';

export function Checkbox(props) {
  const { disabled, errors = [], domId, onBlur, onFocus, field, readonly, value = false } = props;

  const { description, label, validate = {} } = field;

  const { required } = validate;

  const onChange = ({ target }) => {
    props.onChange({
      value: target.checked,
    });
  };

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;
  const form = useService('form');
  const { schema } = form._getState();
  const direction = schema?.direction || 'ltr'; // Fetch the direction value from the form schema

  return (
    <div
      class={classNames(formFieldClasses(type, { errors, disabled, readonly }), { 'fjs-checked': value })}
      style={{
        direction: direction,
        fontFamily: 'Vazirmatn, sans-serif',
      }}>
      <Label htmlFor={domId} label={label} required={required}>
        <input
          checked={value}
          class="fjs-input"
          disabled={disabled}
          readOnly={readonly}
          id={domId}
          type="checkbox"
          onChange={onChange}
          onBlur={() => onBlur && onBlur()}
          onFocus={() => onFocus && onFocus()}
          required={required}
          aria-invalid={errors.length > 0}
          aria-describedby={[descriptionId, errorMessageId].join(' ')}
          style={{
            display: 'flex',
            justifyContent: direction === 'rtl' ? 'flex-end' : 'flex-start',
            fontFamily: 'Vazirmatn, sans-serif',
          }}
        />
      </Label>
      <Description id={descriptionId} description={description} />
      <Errors id={errorMessageId} errors={errors} />
    </div>
  );
}

Checkbox.config = {
  type,
  keyed: true,
  label: 'Checkbox',
  group: 'selection',
  emptyValue: false,
  sanitizeValue: ({ value }) => value === true,
  create: (options = {}) => ({
    ...options,
  }),
};
