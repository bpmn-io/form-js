import {
  isCmd,
  isKey,
  isShift
} from 'diagram-js/lib/features/keyboard/KeyboardUtil';

import {
  KEYS_REDO,
  KEYS_UNDO
} from 'diagram-js/lib/features/keyboard/KeyboardBindings';

const LOW_PRIORITY = 500;

export default class FormEditorKeyboardBindings {
  constructor(eventBus, keyboard) {
    eventBus.on('editorActions.init', LOW_PRIORITY, (event) => {
      const { editorActions } = event;

      this.registerBindings(keyboard, editorActions);
    });
  }

  registerBindings(keyboard, editorActions) {

    function addListener(action, fn) {
      if (editorActions.isRegistered(action)) {
        keyboard.addListener(fn);
      }
    }

    // undo
    // (CTRL|CMD) + Z
    addListener('undo', (context) => {
      const { keyEvent } = context;

      if (isCmd(keyEvent) && !isShift(keyEvent) && isKey(KEYS_UNDO, keyEvent)) {
        editorActions.trigger('undo');

        return true;
      }
    });

    // redo
    // CTRL + Y
    // CMD + SHIFT + Z
    addListener('redo', (context) => {
      const { keyEvent } = context;

      if (isCmd(keyEvent) && (isKey(KEYS_REDO, keyEvent) || (isKey(KEYS_UNDO, keyEvent) && isShift(keyEvent)))) {
        editorActions.trigger('redo');

        return true;
      }
    });

  }
}

FormEditorKeyboardBindings.$inject = [ 'eventBus', 'keyboard' ];