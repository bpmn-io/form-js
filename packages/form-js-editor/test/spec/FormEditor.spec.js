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
      console.log('Form Editor <changed>', event, formEditor.getSchema());
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


  describe('modeling', function() {

    it('should add field', async function() {

      // given
      const formEditor = await waitForFormEditorCreated({
        schema,
        container
      });

      const fieldsSize = formEditor.fields.size;

      // when
      const targetIndex = 0;

      const field = {
        id: 'foo',
        type: 'button'
      };

      let parent = Array.from(formEditor.fields.values()).find(({ parent }) => isUndefined(parent));

      const fields = parent.components.map(({ id }) => id);

      formEditor.addField(
        parent,
        targetIndex,
        field
      );

      // then
      expect(formEditor.fields.size).to.equal(fieldsSize + 1);

      parent = Array.from(formEditor.fields.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ id }) => id)).to.eql([
        field.id,
        ...fields
      ]);
    });


    it('should move field down', async function() {

      // given
      const formEditor = await waitForFormEditorCreated({
        schema,
        container
      });

      const fieldsSize = formEditor.fields.size;

      // when
      const sourceIndex = 0,
            targetIndex = 2;

      let parent = Array.from(formEditor.fields.values()).find(({ parent }) => isUndefined(parent));

      const fields = parent.components.map(({ id }) => id);

      formEditor.moveField(
        parent,
        parent,
        sourceIndex,
        targetIndex
      );

      // then
      expect(formEditor.fields.size).to.equal(fieldsSize);

      parent = Array.from(formEditor.fields.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ id }) => id)).to.eql([
        fields[ 1 ],
        fields[ 0 ],
        ...fields.slice(2)
      ]);
    });


    it('should move field up', async function() {

      // given
      const formEditor = await waitForFormEditorCreated({
        schema,
        container
      });

      const fieldsSize = formEditor.fields.size;

      // when
      const sourceIndex = 1,
            targetIndex = 0;

      let parent = Array.from(formEditor.fields.values()).find(({ parent }) => isUndefined(parent));

      const fields = parent.components.map(({ id }) => id);

      formEditor.moveField(
        parent,
        parent,
        sourceIndex,
        targetIndex
      );

      // then
      expect(formEditor.fields.size).to.equal(fieldsSize);

      parent = Array.from(formEditor.fields.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ id }) => id)).to.eql([
        fields[ 1 ],
        fields[ 0 ],
        ...fields.slice(2)
      ]);
    });


    it('should remove field', async function() {

      // given
      const formEditor = await waitForFormEditorCreated({
        schema,
        container
      });

      const fieldsSize = formEditor.fields.size;

      // when
      const sourceIndex = 0;

      let parent = Array.from(formEditor.fields.values()).find(({ parent }) => isUndefined(parent));

      const fields = parent.components.map(({ id }) => id);

      formEditor.removeField(
        parent,
        sourceIndex
      );

      // then
      expect(formEditor.fields.size).to.equal(fieldsSize - 1);

      parent = Array.from(formEditor.fields.values()).find(({ parent }) => isUndefined(parent));

      expect(parent.components.map(({ id }) => id)).to.eql([
        ...fields.slice(1)
      ]);
    });

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
      input = await screen.getByLabelText('Text');

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
    expect(form.fields.size).to.equal(11);
  });

  return form;
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