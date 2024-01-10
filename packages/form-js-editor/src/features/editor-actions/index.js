import BaseEditorActionsModule from 'diagram-js/lib/features/editor-actions';

import { FormEditorActions } from './FormEditorActions';

export const EditorActionsModule = {
  __depends__: [
    BaseEditorActionsModule
  ],
  editorActions: [ 'type', FormEditorActions ]
};
