import { formFieldClasses } from '../Util';
import { useSingleLineTemplateEvaluation, useService } from '../../hooks';

const type = 'button';

export function Button(props) {
  const { disabled, onFocus, onBlur, field } = props;
  const { action = 'submit' } = field;
  const evaluatedLabel = useSingleLineTemplateEvaluation(field.label || '', { debug: true });

  const form = useService('form');
  const { schema } = form._getState();

  const direction = schema?.direction || 'ltr'; // Fetch the direction value from the form schema

  return (
    <div
      class={formFieldClasses(type)}
      style={{
        direction: direction,
        fontFamily: 'Vazirmatn, sans-serif',
      }}>
      <button
        class="fjs-button"
        type={action}
        disabled={disabled}
        onFocus={() => onFocus && onFocus()}
        onBlur={() => onBlur && onBlur()}>
        {evaluatedLabel}
      </button>
    </div>
  );
}

Button.config = {
  type,
  keyed: false,
  label: 'Button',
  group: 'action',
  create: (options = {}) => ({
    action: 'submit',
    ...options,
  }),
};
