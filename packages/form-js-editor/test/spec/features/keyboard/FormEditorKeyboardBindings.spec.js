import {
  bootstrapFormEditor,
  getFormEditor,
  inject
} from 'test/TestHelper';

import formEditorActionsModule from 'src/features/editor-actions';
import keyboardModule from 'src/features/keyboard';
import modelingModule from 'src/features/modeling';

import { createKeyEvent } from 'diagram-js/test/util/KeyEvents';

import schema from '../../form.json';

var KEYS_REDO = [ 'y', 'Y', 89 ];
var KEYS_UNDO = [ 'z', 'Z', 90 ];


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

  function triggerEvent(key, attrs, target) {
    return getFormEditor().invoke(function(config) {
      target = target || config.renderer.container;

      return target.dispatchEvent(createKeyEvent(key, attrs));
    });
  }

  KEYS_UNDO.forEach((key) => {

    it('should undo', inject(function(config, keyboard, editorActions) {

      // given
      const undoSpy = sinon.spy(editorActions, 'trigger');

      // when
      triggerEvent(key, {
        ctrlKey: true,
        shiftKey: false
      });

      // then
      expect(undoSpy).to.have.been.calledWith('undo');
    }));

  });


  KEYS_REDO.forEach((key) => {

    it('should redo', inject(function(keyboard, editorActions) {

      // given
      const redoSpy = sinon.spy(editorActions, 'trigger');

      // when
      triggerEvent(key, {
        ctrlKey: true,
        shiftKey: false
      });

      // then
      expect(redoSpy).to.have.been.calledWith('redo');
    }));

  });


  it('should undo/redo when focused on input', inject(
    function(formEditor, keyboard, editorActions) {

      // given
      const spy = sinon.spy(editorActions, 'trigger');

      const container = formEditor._container;
      const inputEl = document.createElement('input');

      container.appendChild(inputEl);

      // when
      // select all
      triggerEvent('a', { ctrlKey: true }, inputEl);

      // then
      expect(spy).to.not.have.been.called;

      // when
      // undo/redo
      triggerEvent('z', { ctrlKey: true }, inputEl);
      triggerEvent('y', { ctrlKey: true }, inputEl);

      // then
      expect(spy).to.have.been.called.calledTwice;
    }
  ));

});
