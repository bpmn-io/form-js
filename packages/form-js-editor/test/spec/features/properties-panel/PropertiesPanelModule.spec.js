import TestContainer from 'mocha-test-container-support';

import { act } from '@testing-library/preact/pure';

import {
  query as domQuery
} from 'min-dom';

import {
  insertStyles
} from '../../../TestHelper';

import {
  createFormEditor
} from '../../../../src';

import propertiesPanelModule from '../../../../src/features/properties-panel';

import schema from '../../form.json';

insertStyles();


describe('features/propertiesPanel', function() {

  let formEditor, formContainer, propertiesPanelContainer;

  beforeEach(function() {
    const container = TestContainer.get(this);

    propertiesPanelContainer = document.createElement('div');
    formContainer = document.createElement('div');

    container.appendChild(propertiesPanelContainer);
    container.appendChild(formContainer);
  });

  afterEach(function() {
    const container = TestContainer.get(this);

    container.removeChild(propertiesPanelContainer);
    container.removeChild(formContainer);

    formEditor && formEditor.destroy();
  });

  async function createEditor(schema, options = {}) {
    const {
      additionalModules = [
        propertiesPanelModule
      ]
    } = options;

    formEditor = await createFormEditor({
      schema,
      renderer: {
        container: formContainer
      },
      additionalModules,
      propertiesPanel: {
        parent: propertiesPanelContainer
      },
      ...options
    });

    return { formEditor };
  }


  it('should render on <formEditor.rendered>', async function() {

    // given
    await act(async () => {
      const result = await createEditor(schema);
      formEditor = result.formEditor;
    });

    const eventBus = formEditor.get('eventBus');

    // when
    eventBus.fire('formEditor.rendered');

    // then
    expect(domQuery('.fjs-properties-panel', propertiesPanelContainer)).to.exist;
  });


  it('should attach', async function() {

    // given
    const node = document.createElement('div');
    document.body.appendChild(node);

    let formEditor;

    await act(async () => {
      const result = await createEditor(schema);
      formEditor = result.formEditor;
    });

    const propertiesPanel = formEditor.get('propertiesPanel');

    // when
    await act(() => propertiesPanel.attachTo(node));

    // then
    expect(domQuery('.fjs-properties-panel', propertiesPanelContainer)).to.not.exist;
    expect(domQuery('.fjs-properties-panel', node)).to.exist;

    // cleanup
    document.body.removeChild(node);
  });


  it('should detach', async function() {

    // given
    let formEditor;

    await act(async () => {
      const result = await createEditor(schema);
      formEditor = result.formEditor;
    });

    // assume
    expect(domQuery('.fjs-properties-panel', propertiesPanelContainer)).to.exist;

    const propertiesPanel = formEditor.get('propertiesPanel');

    // when
    await act(() => propertiesPanel.detach());

    // then
    expect(domQuery('.fjs-properties-panel', propertiesPanelContainer)).to.not.exist;
  });


  describe('event emitting', function() {

    it('should fire <propertiesPanel.rendered>', async function() {

      // given
      let formEditor;

      await act(async () => {
        const result = await createEditor(schema);
        formEditor = result.formEditor;
      });

      const eventBus = formEditor.get('eventBus');

      const spy = sinon.spy();

      eventBus.on('propertiesPanel.rendered', spy);

      const propertiesPanel = formEditor.get('propertiesPanel');

      // when
      await act(() => propertiesPanel.attachTo(document.body));

      // then
      expect(spy).to.have.been.called;
    });


    it('should fire <propertiesPanel.attach> when section is rendered', async function() {

      // given
      const { formEditor } = await createEditor(schema);

      const eventBus = formEditor.get('eventBus');
      const propertiesPanel = formEditor.get('propertiesPanel');

      const spy = sinon.spy();

      eventBus.on('propertiesPanel.attach', spy);

      // when
      await act(() => {
        eventBus.fire('propertiesPanel.section.rendered');
        propertiesPanel.attachTo(propertiesPanelContainer);
      });

      // then
      expect(spy).to.have.been.called;
    });


    it('should fire <propertiesPanel.detach> when section is rendered', async function() {

      // given
      const { formEditor } = await createEditor(schema);

      const eventBus = formEditor.get('eventBus');
      const propertiesPanel = formEditor.get('propertiesPanel');

      const spy = sinon.spy();

      eventBus.on('propertiesPanel.detach', spy);

      // when
      await act(() => {
        eventBus.fire('propertiesPanel.section.rendered');
        propertiesPanel.detach();
      });

      // then
      expect(spy).to.have.been.called;
    });


    it('should fire <propertiesPanel.destroyed>', async function() {

      // given
      const node = document.createElement('div');
      document.body.appendChild(node);

      let formEditor;

      await act(async () => {
        const result = await createEditor(schema);
        formEditor = result.formEditor;
      });

      const propertiesPanel = formEditor.get('propertiesPanel');
      const eventBus = formEditor.get('eventBus');

      const spy = sinon.spy();

      eventBus.on('propertiesPanel.destroyed', spy);

      // when
      await act(() => propertiesPanel.attachTo(node));

      // then
      expect(spy).to.have.been.called;
    });

  });

});