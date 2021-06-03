import { formFieldClasses } from '../Util';

import { generateIdForType } from '../../../util';

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

Button.create = function(options = {}) {
  const id = generateIdForType(type);

  return {
    action: 'submit',
    id,
    key: id,
    label: this.label,
    type,
    ...options
  };
};

Button.type = type;

Button.label = 'Button';