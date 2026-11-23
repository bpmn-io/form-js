import { useContext, useMemo } from 'preact/hooks';
import { ChildrenRenderer, FormRenderContext, MultiPage, MultiPageContext } from '@bpmn-io/form-js-viewer';

import { DRAG_NO_MOVE_CLS } from '../../../features/dragging/Dragging';
import { useService } from '../../hooks';
import { editorFormFieldClasses } from '../Util';

/**
 * Lays every page out at once so that all of them can be edited and dropped
 * into. Navigation is left to the viewer. Pages are added through the
 * container, as they are not offered in the palette.
 */
export function EditorMultiPage(props) {
  const { field } = props;
  const { type } = field;

  const { Empty } = useContext(FormRenderContext);

  const modeling = useService('modeling');
  const translate = useService('translate');

  const multiPageContext = useMemo(() => ({ activePageId: null, showAllPages: true, focusOnMount: false }), []);

  const onAddPage = (event) => {
    // keep the click from selecting the container
    event.stopPropagation();

    const index = (field.components || []).length;

    modeling.addFormField({ type: 'page', label: `Page ${index + 1}` }, field, index);
  };

  return (
    <div class={editorFormFieldClasses(type) + ' fjs-form-field-grouplike'}>
      <MultiPageContext.Provider value={multiPageContext}>
        <ChildrenRenderer {...props} Empty={Empty} />
      </MultiPageContext.Provider>
      <button type="button" class={`fjs-multipage-add-page ${DRAG_NO_MOVE_CLS}`} onClick={onAddPage}>
        {translate('Add page')}
      </button>
    </div>
  );
}

EditorMultiPage.config = MultiPage.config;
