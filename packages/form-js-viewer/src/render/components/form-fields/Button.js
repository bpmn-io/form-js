import { formFieldClasses } from '../Util';

const type = 'button';


export default function Button(props) {
  const {
    disabled,
    field
  } = props;

  const { action = 'submit' } = field;

  return <div class={ formFieldClasses(type) }>
    <button class="fjs-button" type={ action } disabled={ disabled }>{ field.label }</button>
  </div>;
}

Button.config = {
  type,
  keyed: true,
  label: 'Button',
  group: 'action',
  create: (options = {}) => ({
    action: 'submit',
    ...options
  })
};
