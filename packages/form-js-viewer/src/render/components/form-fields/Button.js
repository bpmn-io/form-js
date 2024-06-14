import { formFieldClasses } from '../Util';
import { useSingleLineTemplateEvaluation } from '../../hooks';

const type = 'button';

export function Button(props) {
  const { disabled, onFocus, onBlur, field } = props;

  const { action = 'submit' } = field;

  const evaluatedLabel = useSingleLineTemplateEvaluation(field.label || '', { debug: true });

  return (
    <div class={formFieldClasses(type)}>
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
