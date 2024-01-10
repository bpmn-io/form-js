import { formFieldClasses } from '../Util';

const type = 'button';

export function Button(props) {
  const {
    disabled,
    onFocus,
    onBlur,
    field
  } = props;

  const { action = 'submit' } = field;

  return <div class={ formFieldClasses(type) }>
    <button
      class="fjs-button"
      type={ action }
      disabled={ disabled }
      onFocus={ () => onFocus && onFocus() }
      onBlur={ () => onBlur && onBlur() }>
      { field.label }
    </button>
  </div>;
}

Button.config = {
  type,
  keyed: false,
  label: 'Button',
  group: 'action',
  create: (options = {}) => ({
    action: 'submit',
    ...options
  })
};
