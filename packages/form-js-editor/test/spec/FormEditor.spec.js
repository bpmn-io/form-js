import {
  createFormEditor,
  FormEditor,
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


describe('FormEditor', function() {

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

    // when
    const formEditor = await createFormEditor({
      container,
      schema,
      keyboard: {
        bindTo: document
      }
    });

    formEditor.on('changed', event => {
      console.log('Form Editor <changed>', event, formEditor.getSchema());
    });

    // then
    expect(formEditor.get('formFieldRegistry').size).to.equal(11);
  });


  it('should render compact', async function() {

    // when
    await createFormEditor({
      container,
      schema,
      debounce: true,
      renderer: {
        compact: true
      },
      keyboard: {
        bindTo: document
      }
    });

    // then
    const editorContainer = container.querySelector('.fjs-editor-container');

    expect(editorContainer).to.exist;
    expect(editorContainer.matches('.fjs-editor-compact')).to.be.true;
  });


  describe('#importSchema', function() {

    it('should import without errors', async function() {

      // given
      const formEditor = new FormEditor();

      await formEditor.importSchema(schema);

      // then
      expect(formEditor.get('formFieldRegistry').size).to.equal(11);
    });


    it('should fail instantiation with import error', async function() {

      // given
      const schema = {
        type: 'default',
        components: [
          {
            type: 'unknown-component'
          }
        ]
      };

      let error;

      // when
      try {
        await createFormEditor({
          container,
          schema
        });
      } catch (_error) {
        error = _error;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.eql('form field of type <unknown-component> not supported');
    });


    it('should fire <*.clear> before import', async function() {

      // given
      const formEditor = new FormEditor();

      const importDoneSpy = spy();

      formEditor.on('import.done', importDoneSpy);

      await formEditor.importSchema(schema);

      // then
      expect(importDoneSpy).to.have.been.calledOnce;
    });


    it('should fire <import.done> after import success', async function() {

      // given
      const formEditor = new FormEditor();

      const importDoneSpy = spy();

      formEditor.on('import.done', importDoneSpy);

      await formEditor.importSchema(schema);

      // then
      expect(importDoneSpy).to.have.been.calledOnce;
    });


    it('should fire <import.done> after import error', async function() {

      // given
      const schema = {
        type: 'default',
        components: [
          {
            type: 'unknown-component'
          }
        ]
      };

      const formEditor = new FormEditor();

      const importDoneSpy = spy();

      formEditor.on('import.done', importDoneSpy);

      try {
        await formEditor.importSchema(schema);
      } catch (err) {

        // then
        expect(importDoneSpy).to.have.been.calledOnce;
        expect(importDoneSpy).to.have.been.calledWithMatch({ error: err, warnings: err.warnings });
      }
    });

  });


  it('should attach', async function() {

    // when
    const formEditor = await createFormEditor({
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
    const formEditor = await createFormEditor({
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
    const formEditor = await createFormEditor({
      container,
      schema
    });

    // when
    const exportedSchema = formEditor.saveSchema();

    // then
    expect(exportedSchema).to.eql(exportTagged(schema));

    expect(JSON.stringify(exportedSchema)).not.to.contain('"_id"');
  });


  it('#clear', async function() {

    // given
    const formEditor = await createFormEditor({
      container,
      schema
    });

    const diagramClearSpy = spy(),
          formClearSpy = spy();

    formEditor.on('diagram.clear', diagramClearSpy);
    formEditor.on('form.clear', formClearSpy);

    // when
    formEditor.clear();

    // then
    expect(container.childNodes).not.to.be.empty;

    expect(diagramClearSpy).to.have.been.calledOnce;
    expect(formClearSpy).to.have.been.calledOnce;

    expect(formEditor.get('formFieldRegistry')).to.be.empty;
  });


  it('#destroy', async function() {

    // given
    const formEditor = await createFormEditor({
      container,
      schema
    });

    const diagramDestroySpy = spy(),
          formDestroySpy = spy();

    formEditor.on('diagram.destroy', diagramDestroySpy);
    formEditor.on('form.destroy', formDestroySpy);

    // when
    formEditor.destroy();

    // then
    expect(container.childNodes).to.be.empty;

    expect(diagramDestroySpy).to.have.been.calledOnce;
    expect(formDestroySpy).to.have.been.calledOnce;
  });


  it('#on', async function() {

    // given
    const form = await createFormEditor({
      container,
      schema
    });

    const fooSpy = spy();

    // when
    form.on('foo', fooSpy);

    form._emit('foo');

    // then
    expect(fooSpy).to.have.been.calledOnce;
  });


  it('#off', async function() {

    // given
    const form = await createFormEditor({
      container,
      schema
    });

    const fooSpy = spy();

    form.on('foo', fooSpy);

    form._emit('foo');

    // when
    form.off('foo', fooSpy);

    form._emit('foo');

    // then
    expect(fooSpy).to.have.been.calledOnce;
  });


  it('should expose schema', async function() {

    // given
    const formEditor = await createFormEditor({
      container,
      schema
    });

    // when
    const exportedSchema = formEditor.getSchema();

    // then
    expect(exportedSchema).to.eql(exportTagged(schema));

    expect(JSON.stringify(exportedSchema)).not.to.contain('"_id"');
  });


  it('should expose schema with custom exporter', async function() {

    // given
    const exporter = {
      name: 'Foo',
      version: 'bar'
    };

    const formEditor = await createFormEditor({
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
    const formEditor = await createFormEditor({
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
    const formEditor = await createFormEditor({
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
      const formEditor = await createFormEditor({
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
      const formEditor = await createFormEditor({
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
      const formEditor = await createFormEditor({
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

// helpers //////////

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