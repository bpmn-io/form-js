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


  it('should undo/redo when focused on input', inject(function(formEditor, keyboard, editorActions) {

    // given
    const spy = sinon.spy(editorActions, 'trigger');

    const container = formEditor._container;
    const inputField = document.createElement('input');

    container.appendChild(inputField);

    // when
    // select all
    keyboard._keyHandler({ key: 'a', ctrlKey: true, target: inputField });

    // then
    expect(spy).to.not.have.been.called;

    // when
    // undo/redo
    keyboard._keyHandler({ key: 'z', ctrlKey: true, target: inputField, preventDefault: () => {} });
    keyboard._keyHandler({ key: 'y', ctrlKey: true, target: inputField, preventDefault: () => {} });

    // then
    expect(spy).to.have.been.called.calledTwice;
  }));

});
