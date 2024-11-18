import { isUndo, isRedo } from 'diagram-js/lib/features/keyboard/KeyboardUtil';

const LOW_PRIORITY = 500;

export class FormEditorKeyboardBindings {
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

      if (isUndo(keyEvent)) {
        editorActions.trigger('undo');

        return true;
      }
    });

    // redo
    // CTRL + Y
    // CMD + SHIFT + Z
    addListener('redo', (context) => {
      const { keyEvent } = context;

      if (isRedo(keyEvent)) {
        editorActions.trigger('redo');

        return true;
      }
    });
  }
}

FormEditorKeyboardBindings.$inject = ['eventBus', 'keyboard'];
