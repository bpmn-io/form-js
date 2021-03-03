import { createFormEditor } from '../../src';

import { expect } from 'chai';

import {
  insertStyles,
  isSingleStart
} from '../TestHelper';

// import schema from './form.json';
import schema from './empty.json';

insertStyles();

const singleStart = isSingleStart('basic');


describe('createFormEditor', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    document.body.appendChild(container);
  });

  !singleStart && afterEach(function() {
    document.body.removeChild(container);
  });

  (singleStart ? it.only : it)('should render', function() {

    // given
    const formEditor = createFormEditor({
      container,
      schema
    });

    formEditor.on('change', event => {
      console.log('Form Editor <change>', event);
    });
  });


  it('should expose schema', function() {

    // given
    const formEditor = createFormEditor({
      container,
      schema
    });

    // when
    const exportedSchema = formEditor.getSchema();

    // then
    expect(exportedSchema).to.exist;

    expect(JSON.stringify(exportedSchema)).not.to.contain('"id"');
  });


  it('should add button to column', function() {

    // given
    const formEditor = createFormEditor({
      schema,
      container
    });

    // when
    const path = [ 'components', 0, 'columns', 0 ];

    const index = 1;

    const field = { type: 'button' };

    // Add button as second component to first column
    formEditor.addField(path, index, field);
    // formEditor.moveField();
    // formEditor.removeField();
    // formEditor.editField();

    formEditor.on('change', event => {
      console.log('Form Editor <change>', event);
    });
  });


  it('should add column to columns', function() {

    // given
    const formEditor = createFormEditor({
      schema,
      container
    });

    // when
    const path = [ 'components', 0, 'columns' ];

    const index = 2;

    const column = { components: [] };

    // Add column as third column to columns
    formEditor.addField(path, index, column);
    // formEditor.moveField();
    // formEditor.removeField();
    // formEditor.editField();

    formEditor.on('change', event => {
      console.log('Form Editor <change>', event);
    });
  });

});