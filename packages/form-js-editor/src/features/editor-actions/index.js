import EditorActionsModule from 'diagram-js/lib/features/editor-actions';

import FormEditorActions from './FormEditorActions';

export default {
  __depends__: [
    EditorActionsModule
  ],
  editorActions: [ 'type', FormEditorActions ]
};
