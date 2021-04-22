import {
  generateIdForType
} from '../../util';

import { formFieldClasses } from './Util';

const type = 'button';

export default function ButtonRenderer(props) {
  const {
    disabled,
    field
  } = props;

  const { action = 'submit' } = field;

  return <div class={ formFieldClasses(type) }>
    <button class="fjs-button" type={ action } disabled={ disabled }>{ field.label }</button>
  </div>;
}

ButtonRenderer.create = function(options = {}) {
  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: this.label,
    type,
    ...options
  };
};

ButtonRenderer.type = type;

ButtonRenderer.label = 'Button';