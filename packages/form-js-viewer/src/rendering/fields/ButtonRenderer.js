export default function ButtonRenderer(props) {

  const label = () => props.field.label;

  const buttonType = () => {
    switch (props.field.action) {
    case 'reset': return 'reset';
    default: return 'submit';
    }
  };

  return (
    <div class="fjs-form-field">
      <button
        id={ props.id }
        type={ buttonType() }
        class="fjs-button"
        disabled={ props.disabled || props.field.disabled }
      >
        { label() }
      </button>
    </div>
  );
}

ButtonRenderer.create = function(options = {}) {
  return {
    label: 'Button',
    type: 'button',
    ...options
  };
};