import { formFieldClasses } from '../../../src/render/components/Util';

const type = 'button';

function CustomButtonRenderer(props) {
  const {
    disabled,
    field
  } = props;

  const { action = 'submit' } = field;

  return <div class={ formFieldClasses(type) }>
    <button class="fjs-button custom-button" type={ action } disabled={ disabled }>{ field.label }</button>
  </div>;
}

CustomButtonRenderer.label = 'Custom Button';

CustomButtonRenderer.type = type;

class RegisterCustomButtonRenderer {
  constructor(formFields) {
    formFields.register(type, CustomButtonRenderer);
  }
}

export default {
  __init__: [ 'customButtonRenderer' ],
  customButtonRenderer: [ 'type', RegisterCustomButtonRenderer ]
};