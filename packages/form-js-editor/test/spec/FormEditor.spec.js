import {
  createFormEditor,
  schemaVersion
} from '../../src';

import {
  screen,
  waitFor
} from '@testing-library/preact/pure';

import {
  insertStyles,
  isSingleStart
} from '../TestHelper';

import schema from './form.json';

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
      schema,
      debounce: true,
      keyboard: {
        bindTo: document
      }
    });

    formEditor.on('changed', event => {
      console.log('Form Editor <changed>', event, formEditor.getSchema());
    });
  });


  it('should attach', async function() {

    // when
    const formEditor = await waitForFormEditorCreated({
      schema
    });

    // assume
    expect(formEditor._container.parentNode).not.to.exist;

    // when
    formEditor.attachTo(container);

    // then
    expect(formEditor._container.parentNode).to.exist;
  });


  it('should detach', async function() {

    // when
    const formEditor = await waitForFormEditorCreated({
      container,
      schema
    });

    // assume
    expect(formEditor._container.parentNode).to.exist;

    // when
    formEditor.detach();

    // then
    expect(formEditor._container.parentNode).not.to.exist;
  });


  it('#saveSchema', async function() {

    // given
    const formEditor = await waitForFormEditorCreated({
      container,
      schema
    });

    // when
    const exportedSchema = formEditor.saveSchema();

    // then
    expect(exportedSchema).to.eql(exportTagged(schema));

    expect(JSON.stringify(exportedSchema)).not.to.contain('"id"');
  });


  it('#destroy', async function() {

    // given
    const formEditor = await waitForFormEditorCreated({
      container,
      schema
    });

    // when
    formEditor.destroy();

    // then
    expect(container.childNodes).to.be.empty;
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
    expect(exportedSchema).to.eql(exportTagged(schema));

    expect(JSON.stringify(exportedSchema)).not.to.contain('"id"');
  });


  it('should expose schema with custom exporter', async function() {

    // given
    const exporter = {
      name: 'Foo',
      version: 'bar'
    };

    const formEditor = await waitForFormEditorCreated({
      container,
      schema,
      exporter
    });

    // when
    const exportedSchema = formEditor.getSchema();

    // then
    expect(exportedSchema).to.eql(exportTagged(schema, exporter));
  });


  it('should emit event on properties panel focus', async function() {

    // given
    const formEditor = await waitForFormEditorCreated({
      schema,
      container
    });

    const focusinSpy = sinon.spy();

    formEditor.on('propertiesPanel.focusin', focusinSpy);

    let input;

    await waitFor(async () => {
      input = await screen.getByLabelText('Text');

      expect(input).to.exist;
    });

    // when
    input.focus();

    // then
    expect(focusinSpy).to.have.been.called;
  });


  it('should emit event on properties panel blur', async function() {

    // given
    const formEditor = await waitForFormEditorCreated({
      schema,
      container
    });

    const focusoutSpy = sinon.spy();

    formEditor.on('propertiesPanel.focusout', focusoutSpy);

    let input;

    await waitFor(async () => {
      input = await screen.getByLabelText('Text');

      expect(input).to.exist;
    });

    input.focus();

    // when
    input.blur();

    // then
    expect(focusoutSpy).to.have.been.called;
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
        schema
      });

      const dragulaCreatedSpy = spy(),
            dragulaDestroyedSpy = spy();

      formEditor.on('dragula.created', dragulaCreatedSpy);
      formEditor.on('dragula.destroyed', dragulaDestroyedSpy);

      await waitFor(() => expect(dragulaCreatedSpy).to.have.been.calledOnce);

      // when
      formEditor.attachTo(container);

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
      formEditor.detach();

      // then
      expect(dragulaCreatedSpy).to.have.been.calledOnce;
      expect(dragulaDestroyedSpy).to.have.been.calledOnce;
    });

  });

});

async function waitForFormEditorCreated(options) {
  const formEditor = createFormEditor({
    debounce: false,
    ...options
  });

  window.formEditor = formEditor;

  await waitFor(() => {
    expect(formEditor.get('formFieldRegistry').size).to.equal(11);
  });

  return formEditor;
}


function exportTagged(schema, exporter) {

  const exportDetails = exporter ? {
    exporter
  } : {};

  return {
    schemaVersion,
    ...exportDetails,
    ...schema
  };
}