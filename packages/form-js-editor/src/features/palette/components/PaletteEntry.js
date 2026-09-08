import { useService } from '../../../render/hooks';
import { validateNesting } from '../../../util/nesting';

export function PaletteEntry(props) {
  const { type, label, icon, iconUrl, getPaletteIcon } = props;

  const modeling = useService('modeling');
  const formEditor = useService('formEditor');
  const selection = useService('selection');
  const translate = useService('translate');

  const Icon = getPaletteIcon({ icon, iconUrl, label, type });

  // a page belongs inside a multipage container, so keyboard insertion has to be
  // able to target something other than the root form
  const getInsertTarget = (type) => {
    const { schema } = formEditor._getState();
    const selected = selection.get();

    if (selected && Array.isArray(selected.components) && !validateNesting(type, selected.type)) {
      return selected;
    }

    if (!validateNesting(type, schema.type)) {
      return schema;
    }
  };

  const onKeyDown = (event) => {
    if (event.code === 'Enter') {
      const { fieldType: type } = event.target.dataset;

      const target = getInsertTarget(type);

      if (!target) {
        return;
      }

      modeling.addFormField({ type }, target, target.components.length);
    }
  };

  return (
    <button
      type="button"
      class="fjs-palette-field fjs-drag-copy fjs-no-drop"
      data-field-type={type}
      title={translate('Create {label} element', { label: translate(label) })}
      onKeyDown={onKeyDown}>
      {Icon ? <Icon class="fjs-palette-field-icon" width="36" height="36" viewBox="0 0 54 54" /> : null}
      <span class="fjs-palette-field-text">{translate(label)}</span>
    </button>
  );
}
