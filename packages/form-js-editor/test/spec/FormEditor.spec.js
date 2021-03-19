import { createFormEditor } from '../../src';

import { expect } from 'chai';

import { waitFor } from '@testing-library/preact/pure';

import {
  insertStyles,
  isSingleStart
} from '../TestHelper';

import schema from './form.json';

import { isUndefined } from 'min-dash';

// import schema from './empty.json';
// import schema from './complex.json';

insertStyles();

const singleStart = isSingleStart('basic');


describe('createFormEditor', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    container.style.height = '100%';

    document.body.appendChild(container);
  });

  !singleStart && afterEach(function() {
    document.body.removeChild(container);
  });

  (singleStart ? it.only : it)('should render', async function() {

    // given
    const formEditor = await waitForFormEditorCreated({
      container,
      schema
    });

    formEditor.on('changed', event => {
      console.log('Form Editor <changed>', event);
    });
  });


  it('should expose schema', async function() {

    // given
    const formEditor = await waitForFormEditorCreated({
      container,
      schema
    });

    // when
    const exportedSchema = formEditor.getSchema();

    // then
    expect(exportedSchema).to.exist;

    expect(JSON.stringify(exportedSchema)).not.to.contain('"id"');
  });


  it('should add field', async function() {

    // given
    const formEditor = await waitForFormEditorCreated({
      schema,
      container
    });

    // when
    const index = 1;

    const field = {
      id: 'foo',
      type: 'button'
    };

    formEditor.addField(
      Array.from(formEditor.fields.values()).find(({ parent }) => isUndefined(parent)),
      index,
      field
    );

    // then
    expect(formEditor.fields.size).to.equal(7);
    expect(formEditor.fields.get('foo')).to.exist;
  });

});

async function waitForFormEditorCreated(options) {
  const form = createFormEditor(options);

  await waitFor(() => {
    expect(form.fields.size).to.equal(6);
  });

  return form;
}