import KeyboardModule from 'diagram-js/lib/features/keyboard';

import { FormEditorKeyboardBindings } from './FormEditorKeyboardBindings';

export const FormEditorKeyboardModule = {
  __depends__: [
    KeyboardModule
  ],
  __init__: [ 'keyboardBindings' ],
  keyboardBindings: [ 'type', FormEditorKeyboardBindings ]
};