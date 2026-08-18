import { useService } from '../../../render/hooks';

export function PaletteEntry(props) {
  const { type, label, icon, iconUrl, getPaletteIcon } = props;

  const modeling = useService('modeling');
  const formEditor = useService('formEditor');
  const translate = useService('translate');

  const Icon = getPaletteIcon({ icon, iconUrl, label, type });

  const onKeyDown = (event) => {
    if (event.code === 'Enter') {
      const { fieldType: type } = event.target.dataset;

      const { schema } = formEditor._getState();

      // add new form field to last position
      modeling.addFormField({ type }, schema, schema.components.length);
    }
  };

  // the indefinite article is part of the key, not concatenated into it, so both
  // variants stay static and extractable; the label is passed as a replacement
  // to let translations re-order the words freely
  const title = usesIndefiniteArticleAn(type)
    ? translate('Create an {label} element', { label: translate(label) })
    : translate('Create a {label} element', { label: translate(label) });

  return (
    <button
      type="button"
      class="fjs-palette-field fjs-drag-copy fjs-no-drop"
      data-field-type={type}
      title={title}
      onKeyDown={onKeyDown}>
      {Icon ? <Icon class="fjs-palette-field-icon" width="36" height="36" viewBox="0 0 54 54" /> : null}
      <span class="fjs-palette-field-text">{translate(label)}</span>
    </button>
  );
}

// helpers ///////////

function usesIndefiniteArticleAn(type) {
  return ['image'].includes(type);
}
