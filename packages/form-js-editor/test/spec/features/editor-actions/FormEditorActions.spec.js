import {
  bootstrapFormEditor,
  getFormEditor,
  inject
} from 'test/TestHelper';

import formEditorActionsModule from 'src/features/editor-actions';

import schema from '../../form.json';


describe('features/editor-actions', function() {

  let formFieldsLength;

  beforeEach(bootstrapFormEditor(schema, {
    modules: [
      formEditorActionsModule
    ]
  }));

  beforeEach(inject(function(formFieldRegistry, modeling) {
    formFieldsLength = formFieldRegistry.getAll().length;

    const targetIndex = 0;

    const formField = {
      id: 'foo',
      type: 'button'
    };

    const parent = formFieldRegistry.get('Form_1');

    modeling.addFormField(
      formField,
      parent,
      targetIndex
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
    expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength);
  }));


  it('should redo', inject(function(editorActions, formFieldRegistry) {

    // when
    editorActions.trigger('undo');
    editorActions.trigger('redo');

    // then
    expect(formFieldRegistry.get('foo')).to.exist;
    expect(formFieldRegistry.getAll()).to.have.length(formFieldsLength + 1);
  }));

});
