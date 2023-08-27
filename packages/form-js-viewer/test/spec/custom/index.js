import { formFieldClasses } from '../../../src/render/components/Util';

const type = 'button';

function CustomButton(props) {
  const {
    disabled,
    field
  } = props;

  const { action = 'submit' } = field;

  return <div class={ formFieldClasses(type) }>
    <button class="fjs-button custom-button" type={ action } disabled={ disabled }>{ field.label }</button>
  </div>;
}

CustomButton.config = {
  type,
  keyed: true,
  label: 'Custom Button',
  group: 'action',
  create: (options = {}) => ({
    action: 'submit',
    ...options
  })
};

class CustomButtonRegistrer {
  constructor(formFields) {
    formFields.register(type, CustomButton);
  }
}

export default {
  __init__: [ 'customButtonRegisterer' ],
  customButtonRegisterer: [ 'type', CustomButtonRegistrer ]
};