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

import paletteModule from '../../../../src/features/palette';

import schema from '../../form.json';

insertStyles();


describe('features/palette', function() {

  let formEditor, formContainer, paletteContainer;

  beforeEach(function() {
    const container = TestContainer.get(this);

    paletteContainer = document.createElement('div');
    formContainer = document.createElement('div');

    container.appendChild(paletteContainer);
    container.appendChild(formContainer);
  });

  afterEach(function() {
    const container = TestContainer.get(this);

    container.removeChild(paletteContainer);
    container.removeChild(formContainer);

    formEditor && formEditor.destroy();
  });

  async function createEditor(schema, options = {}) {
    const {
      additionalModules = [
        paletteModule
      ]
    } = options;

    formEditor = await createFormEditor({
      schema,
      renderer: {
        container: formContainer
      },
      additionalModules,
      palette: {
        parent: paletteContainer
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
    expect(domQuery('.fjs-palette', paletteContainer)).to.exist;
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

    const palette = formEditor.get('palette');
    const eventBus = formEditor.get('eventBus');

    // when
    await act(() => {
      eventBus.fire('palette.section.rendered');
      return palette.attachTo(node);
    });

    // then
    expect(domQuery('.fjs-palette', paletteContainer)).to.not.exist;
    expect(domQuery('.fjs-palette', node)).to.exist;

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
    expect(domQuery('.fjs-palette', paletteContainer)).to.exist;

    const palette = formEditor.get('palette');
    const eventBus = formEditor.get('eventBus');

    // when
    await act(() => {
      eventBus.fire('palette.section.rendered');
      return palette.detach();
    });

    // then
    expect(domQuery('.fjs-palette', paletteContainer)).to.not.exist;
  });


  describe('event emitting', function() {

    it('should fire <palette.rendered>', async function() {

      // given
      let formEditor;

      await act(async () => {
        const result = await createEditor(schema);
        formEditor = result.formEditor;
      });

      const eventBus = formEditor.get('eventBus');

      const spy = sinon.spy();

      eventBus.on('palette.rendered', spy);

      const palette = formEditor.get('palette');

      // when
      await act(() => {
        eventBus.fire('palette.section.rendered');
        palette.attachTo(document.body);
      });

      // then
      expect(spy).to.have.been.called;
    });


    it('should fire <palette.attach>', async function() {

      // given
      const { formEditor } = await createEditor(schema);

      const eventBus = formEditor.get('eventBus');
      const palette = formEditor.get('palette');

      const spy = sinon.spy();

      eventBus.on('palette.attach', spy);

      // when
      await act(() => {
        eventBus.fire('palette.section.rendered');
        palette.attachTo(paletteContainer);
      });

      // then
      expect(spy).to.have.been.called;
    });


    it('should fire <palette.detach>', async function() {

      // given
      const { formEditor } = await createEditor(schema);

      const eventBus = formEditor.get('eventBus');
      const palette = formEditor.get('palette');

      const spy = sinon.spy();

      eventBus.on('palette.detach', spy);

      // when
      await act(() => {
        eventBus.fire('palette.section.rendered');
        palette.detach();
      });

      // then
      expect(spy).to.have.been.called;
    });


    it('should fire <palette.destroyed>', async function() {

      // given
      const node = document.createElement('div');
      document.body.appendChild(node);

      let formEditor;

      await act(async () => {
        const result = await createEditor(schema);
        formEditor = result.formEditor;
      });

      const palette = formEditor.get('palette');
      const eventBus = formEditor.get('eventBus');

      const spy = sinon.spy();

      eventBus.on('palette.destroyed', spy);

      // when
      await act(() => {
        eventBus.fire('palette.section.rendered');
        palette.attachTo(node);
      });

      // then
      expect(spy).to.have.been.called;
    });

  });

});