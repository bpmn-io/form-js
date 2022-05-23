import {
  schemaVersion,
  createFormEditor,
  FormEditor
} from '../../src';

import schema from './form.json';

import { insertStyles } from '../TestHelper';

import {
  expect
} from 'chai';

insertStyles();


describe('editor exports', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    document.body.appendChild(container);
  });


  it('should render', async function() {

    // when
    const formEditor = await createFormEditor({
      container,
      schema
    });

    // then
    expect(formEditor).to.exist;
  });


  it('should instantiate + render', async function() {

    // when
    const formEditor = new FormEditor({ container });

    await formEditor.importSchema(schema);

    // then
    expect(formEditor).to.exist;
  });


  it('should instantiate with additional options', async function() {

    // when
    const formEditor = new FormEditor({
      container,
      foo: {
        bar: true
      }
    });

    // then
    expect(formEditor).to.exist;
  });


  describe('export', function() {

    it('should expose schema', async function() {

      // given
      const versionedSchema = {
        ...schema,
        schemaVersion
      };

      const formEditor = await createFormEditor({
        container,
        schema: versionedSchema
      });

      // when
      const savedSchema = formEditor.getSchema();

      // then
      expect(savedSchema).to.eql(versionedSchema);
    });


    it('should export schemaVersion', async function() {

      // given
      const formEditor = await createFormEditor({
        container,
        schema
      });

      // when
      const savedSchema = formEditor.getSchema();

      // then
      expect(savedSchema).to.have.property('schemaVersion', schemaVersion);
    });


    it('should keep IDs', async function() {

      // given
      const schema = {
        id: 'FOOBAR',
        type: 'default',
        schemaVersion,
        components: [
          {
            id: 'number',
            type: 'number',
            key: 'number'
          }
        ]
      };

      const formEditor = await createFormEditor({
        container,
        schema
      });

      // when
      const savedSchema = formEditor.getSchema();

      // then
      expect(savedSchema).to.eql(schema);
    });


    it('should assign IDs', async function() {

      // given
      const schema = {
        type: 'default',
        schemaVersion,
        components: [
          {
            type: 'number',
            key: 'number'
          }
        ]
      };

      const formEditor = await createFormEditor({
        container,
        schema
      });

      // when
      const savedSchema = formEditor.saveSchema();

      // then
      expect(savedSchema.id).to.exist;
      expect(savedSchema.components[0].id).to.exist;
    });

  });

});