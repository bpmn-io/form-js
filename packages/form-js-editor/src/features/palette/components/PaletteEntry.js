import {
  iconsByType
} from '../../../render/components/icons';

import { useService } from '../../../render/hooks';

export default function PaletteEntry(props) {
  const {
    type,
    label
  } = props;

  const modeling = useService('modeling');
  const formEditor = useService('formEditor');

  const Icon = iconsByType(type);

  const onKeyDown = (event) => {
    if (event.code === 'Enter') {

      const { fieldType: type } = event.target.dataset;

      const { schema } = formEditor._getState();

      // add new form field to last position
      modeling.addFormField({ type }, schema, schema.components.length);
    }
  };

  return (
    <button
      class="fjs-palette-field fjs-drag-copy fjs-no-drop"
      data-field-type={ type }
      title={ `Create ${getIndefiniteArticle(type)} ${label} element` }
      onKeyDown={ onKeyDown }
    >
      {
        Icon ? <Icon class="fjs-palette-field-icon" width="36" height="36" viewBox="0 0 54 54" /> : null
      }
      <span class="fjs-palette-field-text">{ label }</span>
    </button>
  );
}


// helpers ///////////

function getIndefiniteArticle(type) {
  if ([
    'image'
  ].includes(type)) {
    return 'an';
  }

  return 'a';
}