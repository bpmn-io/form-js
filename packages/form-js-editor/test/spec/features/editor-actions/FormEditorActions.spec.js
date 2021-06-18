import { isUndefined } from 'min-dash';

import {
  bootstrapFormEditor,
  getFormEditor,
  inject
} from 'test/TestHelper';

import formEditorActionsModule from 'src/features/editor-actions';

import schema from '../../form.json';


describe('features/editor-actions', function() {

  let formFieldsSize;

  beforeEach(bootstrapFormEditor(schema, {
    modules: [
      formEditorActionsModule
    ]
  }));

  beforeEach(inject(function(formFieldRegistry, modeling) {
    formFieldsSize = formFieldRegistry.size;

    const targetIndex = 0;

    const formField = {
      _id: 'foo',
      type: 'button'
    };

    const parent = Array.from(formFieldRegistry.values()).find(({ _parent }) => isUndefined(_parent));

    modeling.addFormField(
      parent,
      targetIndex,
      formField
    );
  }));

  afterEach(function() {
    getFormEditor().destroy();
  });


  it('should undo', inject(function(editorActions, formFieldRegistry) {

    // when
    editorActions.trigger('undo');

    // then
    expect(formFieldRegistry.get('foo')).not.to.exist;
    expect(formFieldRegistry.size).to.equal(formFieldsSize);
  }));


  it('should redo', inject(function(editorActions, formFieldRegistry) {

    // when
    editorActions.trigger('undo');
    editorActions.trigger('redo');

    // then
    expect(formFieldRegistry.get('foo')).to.exist;
    expect(formFieldRegistry.size).to.equal(formFieldsSize + 1);
  }));

});
