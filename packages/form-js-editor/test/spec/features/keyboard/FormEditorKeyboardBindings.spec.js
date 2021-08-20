import {
  bootstrapFormEditor,
  getFormEditor,
  inject
} from 'test/TestHelper';

import formEditorActionsModule from 'src/features/editor-actions';
import keyboardModule from 'src/features/keyboard';
import modelingModule from 'src/features/modeling';

import { createKeyEvent } from 'diagram-js/test/util/KeyEvents';

import {
  KEYS_REDO,
  KEYS_UNDO
} from 'diagram-js/lib/features/keyboard/KeyboardBindings';

import schema from '../../form.json';


describe('features/editor-actions', function() {

  beforeEach(bootstrapFormEditor(schema, {
    modules: [
      modelingModule,
      formEditorActionsModule,
      keyboardModule
    ]
  }));

  afterEach(function() {
    getFormEditor().destroy();
  });


  KEYS_UNDO.forEach((key) => {

    it('should undo', inject(function(keyboard, editorActions) {

      // given
      const undoSpy = sinon.spy(editorActions, 'trigger');

      const event = createKeyEvent(key, {
        ctrlKey: true,
        shiftKey: false
      });

      // when
      keyboard._keyHandler(event);

      // then
      expect(undoSpy).to.have.been.calledWith('undo');
    }));

  });


  KEYS_REDO.forEach((key) => {

    it('should redo', inject(function(keyboard, editorActions) {

      // given
      const redoSpy = sinon.spy(editorActions, 'trigger');

      const event = createKeyEvent(key, {
        ctrlKey: true,
        shiftKey: false
      });

      // when
      keyboard._keyHandler(event);

      // then
      expect(redoSpy).to.have.been.calledWith('redo');
    }));

  });

});
