import { createFormEditor } from '../../src';

import {
  screen,
  waitFor
} from '@testing-library/preact/pure';

import {
  insertStyles,
  isSingleStart
} from '../TestHelper';

import schema from './form.json';

import { isUndefined } from 'min-dash';

// import schema from './empty.json';
// import schema from './complex.json';

insertStyles();

const spy = sinon.spy;

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
    expect(exportedSchema).to.eql(schema);
    expect(JSON.stringify(exportedSchema)).not.to.contain('"id"');
  });


  it('should add field', async function() {

    // given
    const formEditor = await waitForFormEditorCreated({
      schema,
      container
    });

    const fieldsSize = formEditor.fields.size;

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
    expect(formEditor.fields.size).to.equal(fieldsSize + 1);
    expect(formEditor.fields.get('foo')).to.exist;
  });


  it('should emit event on properties panel focus', async function() {

    // given
    const formEditor = await waitForFormEditorCreated({
      schema,
      container
    });

    const focusinSpy = sinon.spy();

    formEditor.on('propertiesPanel.focusin', focusinSpy);

    // when
    let input;

    await waitFor(async () => {
      input = await screen.getByLabelText('Field Label');

      expect(input).to.exist;
    });

    input.focus();

    // then
    expect(focusinSpy).to.have.been.called;
  });


  describe('drag & drop', function() {

    it('should enable drag and drop on mount', async function() {

      // given
      const formEditor = await waitForFormEditorCreated({
        schema,
        container
      });

      const dragulaCreatedSpy = spy(),
            dragulaDestroyedSpy = spy();

      formEditor.on('dragula.created', dragulaCreatedSpy);
      formEditor.on('dragula.destroyed', dragulaDestroyedSpy);

      await waitFor(() => expect(dragulaCreatedSpy).to.have.been.calledOnce);

      // then
      expect(dragulaCreatedSpy).to.have.been.calledOnce;
      expect(dragulaDestroyedSpy).not.to.have.been.called;
    });


    it('should enable drag and drop on attach', async function() {

      // given
      const formEditor = await waitForFormEditorCreated({
        schema,
        container
      });

      const dragulaCreatedSpy = spy(),
            dragulaDestroyedSpy = spy();

      formEditor.on('dragula.created', dragulaCreatedSpy);
      formEditor.on('dragula.destroyed', dragulaDestroyedSpy);

      await waitFor(() => expect(dragulaCreatedSpy).to.have.been.calledOnce);

      // when
      formEditor.emitter.emit('attach');

      // then
      expect(dragulaCreatedSpy).to.have.been.calledTwice;
      expect(dragulaDestroyedSpy).to.have.been.calledOnce;
    });


    it('should disable drag and drop on detach', async function() {

      // given
      const formEditor = await waitForFormEditorCreated({
        schema,
        container
      });

      const dragulaCreatedSpy = spy(),
            dragulaDestroyedSpy = spy();

      formEditor.on('dragula.created', dragulaCreatedSpy);
      formEditor.on('dragula.destroyed', dragulaDestroyedSpy);

      await waitFor(() => expect(dragulaCreatedSpy).to.have.been.calledOnce);

      // when
      formEditor.emitter.emit('detach');

      // then
      expect(dragulaCreatedSpy).to.have.been.calledOnce;
      expect(dragulaDestroyedSpy).to.have.been.calledOnce;
    });

  });

});

async function waitForFormEditorCreated(options) {
  const form = createFormEditor(options);

  await waitFor(() => {
    expect(form.fields.size).to.equal(7);
  });

  return form;
}