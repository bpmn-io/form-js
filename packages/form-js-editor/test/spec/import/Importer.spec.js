import {
  bootstrapFormEditor,
  getFormEditor,
  inject
} from 'test/TestHelper';

import { clone } from '@bpmn-io/form-js-viewer';

import schema from '../form.json';
import schemaNoIds from '../form-no-ids.json';
import other from '../other.json';


describe('Importer', function() {

  beforeEach(bootstrapFormEditor());

  afterEach(function() {
    getFormEditor().destroy();
  });


  it('should import without errors', inject(async function(formEditor, formFieldRegistry) {

    // when
    const {
      warnings
    } = await formEditor.importSchema(schema);

    // then
    expect(warnings).to.be.empty;

    expect(formFieldRegistry.getAll()).to.have.length(16);
  }));


  it('should reimport without errors', inject(async function(formEditor, formFieldRegistry) {

    // given
    await formEditor.importSchema(schema);

    // assume
    expect(formFieldRegistry.getAll()).to.have.length(16);

    // when
    const result = await formEditor.importSchema(other);

    // then
    expect(result.warnings).to.be.empty;
    expect(formFieldRegistry.getAll()).to.have.length(5);
  }));


  describe('import behavior', function() {

    it('should deep enrich fields', inject(async function(formEditor, formFieldRegistry) {

      // when
      await formEditor.importSchema(schemaNoIds);

      const { schema } = formEditor._getState();

      // then
      expect(schema.id).to.exist;
      expect(schema._path).to.eql([]);

      for (const [ key, component ] of Object.entries(schema.components)) {
        expect(component.id).to.exist;
        expect(component._path).to.eql([ 'components', parseInt(key) ]);
        expect(component._parent).to.eql(schema.id);
      }

      const result = await formEditor.importSchema(other);

      // then
      expect(result.warnings).to.be.empty;
      expect(formFieldRegistry.getAll()).to.have.length(5);
    }));

  });


  describe('error handling', function() {

    it('should indicate unsupported field type', inject(async function(formEditor) {

      // given
      const errorSchema = {
        type: 'unknown'
      };

      let error;

      // when
      try {
        await formEditor.importSchema(errorSchema);
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.eql('form field of type <unknown> not supported');

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));


    it('should indicate duplicate <key>', inject(async function(formEditor) {

      // given
      const errorSchema = {
        type: 'default',
        components: [
          {
            key: 'creditor',
            type: 'textfield'
          },
          {
            key: 'creditor',
            type: 'textfield'
          }
        ]
      };

      let error;

      // when
      try {
        await formEditor.importSchema(errorSchema);
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.eql('form field with key <creditor> already exists');

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));


    it('should indicate duplicate <id>', inject(async function(formEditor) {

      // given
      const errorSchema = {
        type: 'default',
        components: [
          {
            id: 'foo',
            type: 'text'
          },
          {
            id: 'foo',
            type: 'text'
          }
        ]
      };

      let error;

      // when
      try {
        await formEditor.importSchema(errorSchema);
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.eql('form field with id <foo> already exists');

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));


    it('should handle broken JSON', inject(async function(formEditor) {

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
      const errorSchema = clone(schema);

      errorSchema.components.push({
        type: 'select',
        key: 'foo',
        values: 123
      });

      let error;

      // when
      try {
        await formEditor.importSchema(errorSchema);
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;

      expect(error.warnings).to.exist;
      expect(error.warnings).to.be.empty;
    }));

  });

});