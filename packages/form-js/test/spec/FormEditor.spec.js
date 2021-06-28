import {
  schemaVersion,
  createFormEditor,
  FormEditor
} from '../../src';

import schema from './form.json';

import { insertStyles } from '../TestHelper';

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


  it('should export schemaVersion', async function() {

    // given
    const formEditor = await createFormEditor({
      container,
      schema
    });

    // when
    const savedSchema = formEditor.getSchema();

    expect(savedSchema).to.have.property('schemaVersion', schemaVersion);
  });


  it('should export, keeping <id>', async function() {

    // given
    const schema = {
      id: 'FOOBAR',
      type: 'default',
      schemaVersion,
      compontents: [
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

});