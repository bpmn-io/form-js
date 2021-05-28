import { schemaVersion, createFormEditor } from '../../src';

import schema from './form.json';

import { insertStyles } from '../TestHelper';

insertStyles();


describe('createFormEditor', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    document.body.appendChild(container);
  });


  it('should render', function() {

    // when
    const formEditor = createFormEditor({
      container,
      schema
    });

    // then
    expect(formEditor).to.exist;
  });


  it('should export schemaVersion', function() {

    // given
    const formEditor = createFormEditor({
      container,
      schema
    });

    // when
    const savedSchema = formEditor.getSchema();

    expect(savedSchema).to.have.property('schemaVersion', schemaVersion);
  });

});