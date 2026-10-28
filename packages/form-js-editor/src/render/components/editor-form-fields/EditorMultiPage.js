import { useContext, useMemo } from 'preact/hooks';
import { ChildrenRenderer, FormRenderContext, MultiPage, MultiPageContext } from '@bpmn-io/form-js-viewer';

import { editorFormFieldClasses } from '../Util';

/**
 * Lays every page out at once so that all of them can be edited and dropped
 * into. Navigation is left to the viewer.
 */
export function EditorMultiPage(props) {
  const { field } = props;
  const { type } = field;

  const { Empty } = useContext(FormRenderContext);

  const multiPageContext = useMemo(() => ({ activePageId: null, showAllPages: true, focusOnMount: false }), []);

  return (
    <div class={editorFormFieldClasses(type) + ' fjs-form-field-grouplike'}>
      <MultiPageContext.Provider value={multiPageContext}>
        <ChildrenRenderer {...props} Empty={Empty} />
      </MultiPageContext.Provider>
    </div>
  );
}

EditorMultiPage.config = MultiPage.config;
