export default function Button(props) {
  const {
    disabled,
    field
  } = props;

  const { action = 'submit' } = field;

  return <div class="fjs-form-field">
    <button class="fjs-button" type={ action } disabled={ disabled }>{ field.label }</button>
  </div>;
}

Button.create = function(options = {}) {
  return {
    label: 'Button',
    type: 'button',
    ...options
  };
};