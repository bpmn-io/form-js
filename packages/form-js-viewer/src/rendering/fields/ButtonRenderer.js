import {
  generateIdForType
} from '../../util';

import { formFieldClasses } from './Util';


export default function ButtonRenderer(props) {
  const {
    disabled,
    field
  } = props;

  const { action = 'submit' } = field;

  return <div class={ formFieldClasses() }>
    <button class="fjs-button" type={ action } disabled={ disabled }>{ field.label }</button>
  </div>;
}

ButtonRenderer.create = function(options = {}) {
  const type = 'button';

  const id = generateIdForType(type);

  return {
    id,
    key: id,
    label: this.label,
    type,
    ...options
  };
};

ButtonRenderer.type = 'button';

ButtonRenderer.label = 'Button';