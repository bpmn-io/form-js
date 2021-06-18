import {
  bootstrapFormEditor,
  getFormEditor,
  inject
} from 'test/TestHelper';

import { clone } from '@bpmn-io/form-js-viewer';

import schema from '../form.json';


describe('Importer', function() {

  beforeEach(bootstrapFormEditor());

  afterEach(function() {
    getFormEditor().destroy();
  });


  it('should import without errors', inject(async function(formEditor, formFieldRegistry) {

    // when
    const { err, warnings } = await formEditor.importSchema(schema);

    // then
    expect(err).not.to.exist;
    expect(warnings).to.be.empty;

    expect(formFieldRegistry.size).to.equal(11);
  }));


  it('should error if form field of type not supported', inject(async function(formEditor) {

    // given
    const error = clone(schema);

    error.components.push({
      type: 'foo'
    });

    // when
    try {
      await formEditor.importSchema(error);
    } catch (err) {

      // then
      expect(err).to.exist;
      expect(err.message).to.eql('form field of type <foo> not supported');

      expect(err.warnings).to.exist;
      expect(err.warnings).to.be.empty;
    }
  }));


  it('should error if form field with key already exists', inject(async function(formEditor) {

    // given
    const error = clone(schema);

    error.components.push({
      type: 'textfield',
      key: 'creditor'
    });

    // when
    try {
      await formEditor.importSchema(error);
    } catch (err) {

      // then
      expect(err).to.exist;
      expect(err.message).to.eql('form field with key <creditor> already exists');

      expect(err.warnings).to.exist;
      expect(err.warnings).to.be.empty;
    }
  }));


  it('should error if broken JSON is imported', inject(async function(formEditor) {

    // when
    try {
      await formEditor.importSchema('foo');
    } catch (err) {

      // then
      expect(err).to.exist;
      expect(err.message).to.equal('form field of type <undefined> not supported');

      expect(err.warnings).to.exist;
      expect(err.warnings).to.be.empty;
    }
  }));


  // TODO: Catch broken schema errors during import
  it.skip('should error if broken schema is imported', inject(async function(formEditor) {

    // given
    const error = clone(schema);

    error.components.push({
      type: 'select',
      key: 'foo',
      values: 123
    });

    // when
    try {
      await formEditor.importSchema(error);
    } catch (err) {

      // then
      expect(err).to.exist;

      expect(err.warnings).to.exist;
      expect(err.warnings).to.be.empty;
    }
  }));

});