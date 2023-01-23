import {
  createFormEditor,
  FormEditor,
  schemaVersion
} from '../../src';

import {
  act,
  fireEvent,
  screen,
  waitFor
} from '@testing-library/preact/pure';

import {
  query as domQuery
} from 'min-dom';

import {
  insertStyles,
  isSingleStart
} from '../TestHelper';

import schema from './form.json';
import schemaNoIds from './form-no-ids.json';

insertStyles();

const spy = sinon.spy;

const singleStart = isSingleStart('basic');


describe('FormEditor', function() {

  let container,
      formEditor;

  beforeEach(function() {
    container = document.createElement('div');

    container.style.height = '100%';

    document.body.appendChild(container);
  });

  !singleStart && afterEach(function() {
    document.body.removeChild(container);

    formEditor && formEditor.destroy();
  });

  (singleStart ? it.only : it)('should render', async function() {

    // when
    formEditor = await createFormEditor({
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
    expect(formEditor.get('formFieldRegistry').getAll()).to.have.length(16);
  });


  it('should render compact', async function() {

    // when
    formEditor = await createFormEditor({
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

    it('should import empty schema', async function() {

      // given
      const schema = {
        type: 'default'
      };

      // when
      formEditor = new FormEditor();

      await formEditor.importSchema(schema);

      // then
      expect(formEditor.get('formFieldRegistry').getAll()).to.have.length(1);
    });


    it('should import without errors', async function() {

      // given
      formEditor = new FormEditor();

      await formEditor.importSchema(schema);

      // then
      expect(formEditor.get('formFieldRegistry').getAll()).to.have.length(16);
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
        formEditor = await createFormEditor({
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
      formEditor = new FormEditor();

      const importDoneSpy = spy();

      formEditor.on('import.done', importDoneSpy);

      await formEditor.importSchema(schema);

      // then
      expect(importDoneSpy).to.have.been.calledOnce;
    });


    it('should fire <import.done> after import success', async function() {

      // given
      formEditor = new FormEditor();

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

      formEditor = new FormEditor();

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
    formEditor = await createFormEditor({
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
    formEditor = await createFormEditor({
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
    formEditor = await createFormEditor({
      container,
      schema
    });

    // when
    const exportedSchema = formEditor.saveSchema();

    // then
    expect(exportedSchema).to.eql(exportTagged(schema));

    const exportedString = JSON.stringify(exportedSchema);

    expect(exportedString).not.to.contain('"_path"');
    expect(exportedString).not.to.contain('"_parent"');
  });


  it('#clear', async function() {

    // given
    formEditor = await createFormEditor({
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

    expect(formEditor.get('formFieldRegistry').getAll()).to.be.empty;
  });


  it('#destroy', async function() {

    // given
    formEditor = await createFormEditor({
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
    formEditor = await createFormEditor({
      container,
      schema
    });

    const fooSpy = spy();

    // when
    formEditor.on('foo', fooSpy);

    formEditor._emit('foo');

    // then
    expect(fooSpy).to.have.been.calledOnce;
  });


  it('#off', async function() {

    // given
    formEditor = await createFormEditor({
      container,
      schema
    });

    const fooSpy = spy();

    formEditor.on('foo', fooSpy);

    formEditor._emit('foo');

    // when
    formEditor.off('foo', fooSpy);

    formEditor._emit('foo');

    // then
    expect(fooSpy).to.have.been.calledOnce;
  });


  describe('event emitting', function() {

    it('should emit <formEditor.rendered>', async function() {

      // given
      const spy = sinon.spy();

      const formEditor = new FormEditor();

      const eventBus = formEditor.get('eventBus');

      eventBus.on('formEditor.rendered', spy);

      // when
      await act(async () => await formEditor.importSchema(schema));

      // then
      expect(spy).to.have.been.called;
    });

  });


  describe('export', function() {

    it('should expose schema', async function() {

      // given
      formEditor = await createFormEditor({
        container,
        schema
      });

      // when
      const exportedSchema = formEditor.saveSchema();

      // then
      expect(exportedSchema).to.eql(exportTagged(schema));

      const exportedString = JSON.stringify(exportedSchema);

      expect(exportedString).not.to.contain('"_path"');
      expect(exportedString).not.to.contain('"_parent"');
    });


    it('should expose custom exporter', async function() {

      // given
      const exporter = {
        name: 'Foo',
        version: 'bar'
      };

      formEditor = await createFormEditor({
        container,
        schema,
        exporter
      });

      // when
      const exportedSchema = formEditor.saveSchema();

      // then
      expect(exportedSchema).to.eql(exportTagged(schema, exporter));
    });


    it('should override custom exporter', async function() {

      // given
      const oldExporter = {
        name: 'Foo',
        version: 'bar'
      };

      const newExporter = {
        name: 'Baz',
        version: 'qux'
      };

      const taggedSchema = exportTagged(schema, oldExporter);

      formEditor = await createFormEditor({
        container,
        schema: taggedSchema,
        exporter: newExporter
      });

      // when
      const exportedSchema = formEditor.saveSchema();

      // then
      expect(exportedSchema.exporter).to.eql(newExporter);
      expect(exportedSchema).to.eql(exportTagged(schema, newExporter));
    });


    it('should generate ids', async function() {

      // assume
      expect(schemaNoIds.id).not.to.exist;

      // given
      formEditor = await createFormEditor({
        container,
        schema: schemaNoIds
      });

      // when
      const exportedSchema = formEditor.saveSchema();

      // then
      expect(exportedSchema.id).to.exist;

      for (const component of exportedSchema.components) {
        expect(component.id).to.exist;
      }
    });

  });


  it('should generate unique ID for every instance', async function() {

    // given
    const schema = {
      components: [
        {
          id: 'Text_1',
          type: 'textfield'
        }
      ],
      id: 'Form_1',
      type: 'default'
    };

    // when
    const formEditor = await createFormEditor({
      container,
      schema
    });

    // then
    expect(formEditor._id).to.exist;
  });


  describe('palette', function() {

    const schema = {
      components: [
        {
          id: 'Text_1',
          text: 'Foo',
          type: 'text'
        }
      ],
      id: 'Form_1',
      type: 'default'
    };


    it('should provide palette module', async function() {

      // when
      formEditor = await createFormEditor({
        container,
        schema
      });

      expect(formEditor.get('palette')).to.exist;
    });


    it('should render palette per default', async function() {

      // given
      formEditor = await createFormEditor({
        container,
        schema
      });

      // when
      const paletteContainer = domQuery('.fjs-editor-palette-container', container);

      // then
      expect(paletteContainer).to.exist;
    });


    it('should render palette on given container', async function() {

      // given
      const paletteParent = document.createElement('div');
      document.body.appendChild(paletteParent);

      formEditor = await createFormEditor({
        container,
        schema,
        palette: {
          parent: paletteParent
        }
      });

      // when
      const paletteContainer = domQuery('.fjs-palette-container', paletteParent);

      // then
      expect(domQuery('.fjs-editor-palette-container', container)).to.not.exist;
      expect(paletteContainer).to.exist;

      document.body.removeChild(paletteParent);
    });

  });


  describe('properties panel', function() {

    it('should provide propertiesPanel module', async function() {

      // when
      formEditor = await createFormEditor({
        container,
        schema
      });

      expect(formEditor.get('propertiesPanel')).to.exist;
    });


    it('should render propertiesPanel per default', async function() {

      // given
      formEditor = await createFormEditor({
        container,
        schema
      });

      // when
      const propertiesContainer = domQuery('.fjs-editor-properties-container', container);

      // then
      expect(propertiesContainer).to.exist;
    });


    it('should render propertiesPanel on given container', async function() {

      // given
      const propertiesParent = document.createElement('div');
      document.body.appendChild(propertiesParent);

      formEditor = await createFormEditor({
        container,
        schema,
        propertiesPanel: {
          parent: propertiesParent
        }
      });

      // when
      const propertiesContainer = domQuery('.fjs-properties-container', propertiesParent);

      // then
      expect(domQuery('.fjs-editor-properties-container', container)).to.not.exist;
      expect(propertiesContainer).to.exist;

      document.body.removeChild(propertiesParent);
    });


    describe('selection behavior', function() {

      const schema = {
        components: [
          {
            id: 'Text_1',
            text: 'Foo',
            type: 'text'
          }
        ],
        id: 'Form_1',
        type: 'default'
      };


      it('should show schema per default', async function() {

        // when
        formEditor = await createFormEditor({
          container,
          schema
        });

        // assume
        expect(formEditor.get('selection').get()).not.to.exist;

        // then
        await expectSelected('Form_1');
      });


      it('should update on selection changed', async function() {

        // given
        formEditor = await createFormEditor({
          container,
          schema
        });

        await expectSelected('Form_1');

        const text1 = formEditor.get('formFieldRegistry').get('Text_1');

        // when
        formEditor.get('selection').set(text1);

        await expectSelected('Text_1');

        // then
        expectSelected('Text_1');
      });

    });


    describe('focus / blur events', function() {

      const schema = {
        components: [
          {
            id: 'Textfield_1',
            label: 'Foo',
            type: 'textfield'
          }
        ],
        id: 'Form_1',
        type: 'default'
      };


      it('should emit event on properties panel focus', async function() {

        // given
        formEditor = await createFormEditor({
          schema,
          container
        });

        const focusinSpy = sinon.spy();

        formEditor.on('propertiesPanel.focusin', focusinSpy);

        await expectSelected('Form_1');

        const textfield = formEditor.get('formFieldRegistry').get('Textfield_1');

        formEditor.get('selection').set(textfield);

        await expectSelected('Textfield_1');

        // open group to make entry focusable
        const group = await screen.getByText('General');
        fireEvent.click(group);

        const input = await screen.getByLabelText('Field label');

        // when
        input.focus();

        // then
        expect(focusinSpy).to.have.been.called;
      });


      it('should emit event on properties panel blur', async function() {

        // given
        formEditor = await createFormEditor({
          schema,
          container
        });

        const focusoutSpy = sinon.spy();

        formEditor.on('propertiesPanel.focusout', focusoutSpy);

        await expectSelected('Form_1');

        const textfield = formEditor.get('formFieldRegistry').get('Textfield_1');

        formEditor.get('selection').set(textfield);

        await expectSelected('Textfield_1');

        // open group to make entry focusable
        const group = await screen.getByText('General');
        fireEvent.click(group);

        const input = await screen.getByLabelText('Field label');

        input.focus();

        // when
        input.blur();

        // then
        expect(focusoutSpy).to.have.been.called;
      });

    });

  });


  describe('drag & drop', function() {

    it('should enable drag and drop on mount', async function() {

      // given
      formEditor = await createFormEditor({
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
      formEditor = await createFormEditor({
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
      formEditor = await createFormEditor({
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


    it('should create and select new form field', async function() {

      // given
      formEditor = await createFormEditor({
        schema,
        container
      });

      await expectDragulaCreated(formEditor);

      // assume
      const formFieldRegistry = formEditor.get('formFieldRegistry');

      expect(formFieldRegistry.getAll()).to.have.length(16);

      // when
      startDragging(container);
      moveDragging(container);
      endDragging(container);

      // then
      expect(formFieldRegistry.getAll()).to.have.length(17);

      const selection = formEditor.get('selection');

      expect(selection.get()).to.include({ type: 'textfield' });
    });


    describe('emit', function() {

      it('should emit <drag.start>', async function() {

        // given
        formEditor = await createFormEditor({
          schema,
          container
        });

        const draggerSpy = spy();

        formEditor.on('drag.start', draggerSpy);

        await expectDragulaCreated(formEditor);

        // when
        startDragging(container);
        moveDragging(container);

        // then
        expect(draggerSpy).to.have.been.called;

        const context = draggerSpy.args[0][1];
        expect(context.element).to.exist;
        expect(context.source).to.exist;
      });


      it('should emit <drag.end>', async function() {

        // given
        formEditor = await createFormEditor({
          schema,
          container
        });

        const draggerSpy = spy();

        formEditor.on('drag.end', draggerSpy);

        await expectDragulaCreated(formEditor);

        // when
        startDragging(container);
        moveDragging(container);
        endDragging(container);

        // then
        expect(draggerSpy).to.have.been.called;

        const context = draggerSpy.args[0][1];
        expect(context.element).to.exist;
      });

      it('should emit <drag.drop>', async function() {

        // given
        formEditor = await createFormEditor({
          schema,
          container
        });

        const draggerSpy = spy();

        formEditor.on('drag.drop', draggerSpy);

        await expectDragulaCreated(formEditor);

        // when
        startDragging(container);
        moveDragging(container);
        endDragging(container);

        // then
        expect(draggerSpy).to.have.been.called;

        const context = draggerSpy.args[0][1];
        expect(context.element).to.exist;
        expect(context.source).to.exist;
        expect(context.target).to.exist;
        expect(context.sibling).to.exist;
      });


      it('should emit <drag.hover>', async function() {

        // given
        formEditor = await createFormEditor({
          schema,
          container
        });

        const draggerSpy = spy();

        formEditor.on('drag.hover', draggerSpy);

        await expectDragulaCreated(formEditor);

        // when
        startDragging(container);
        moveDragging(container);

        // then
        expect(draggerSpy).to.have.been.called;

        const context = draggerSpy.args[0][1];
        expect(context.element).to.exist;
        expect(context.container).to.exist;
        expect(context.source).to.exist;
      });


      it('should emit <drag.hover>', async function() {

        // given
        formEditor = await createFormEditor({
          schema,
          container
        });

        const draggerSpy = spy();

        formEditor.on('drag.hover', draggerSpy);

        await expectDragulaCreated(formEditor);

        // when
        startDragging(container);
        moveDragging(container);
        endDragging(container);

        // then
        expect(draggerSpy).to.have.been.called;

        const context = draggerSpy.args[0][1];
        expect(context.element).to.exist;
        expect(context.container).to.exist;
        expect(context.source).to.exist;
      });


      it('should emit <drag.out>', async function() {

        // given
        formEditor = await createFormEditor({
          schema,
          container
        });

        const draggerSpy = spy();

        formEditor.on('drag.out', draggerSpy);

        await expectDragulaCreated(formEditor);

        // when
        startDragging(container);
        moveDragging(container);
        endDragging(container);

        // then
        expect(draggerSpy).to.have.been.called;

        const context = draggerSpy.args[0][1];
        expect(context.element).to.exist;
        expect(context.container).to.exist;
        expect(context.source).to.exist;
      });


      it('should emit <drag.cancel>', async function() {

        // given
        formEditor = await createFormEditor({
          schema,
          container
        });

        const draggerSpy = spy();

        formEditor.on('drag.cancel', draggerSpy);

        await expectDragulaCreated(formEditor);

        // when
        startDragging(container);
        moveDragging(container);
        endDragging(container);

        // then
        expect(draggerSpy).to.have.been.called;

        const context = draggerSpy.args[0][1];
        expect(context.element).to.exist;
        expect(context.container).to.exist;
        expect(context.source).to.exist;
      });

    });

  });

});

// helpers //////////

function exportTagged(schema, exporter) {

  const exportDetails = exporter ? {
    exporter
  } : {};

  const test = {
    ...schema,
    ...exportDetails,
    schemaVersion
  };

  return test;
}

async function expectSelected(expectedId) {
  await waitFor(() => {
    const propertiesPanel = document.querySelector('.fjs-properties-panel');

    const selectedId = propertiesPanel.dataset.field;

    expect(selectedId).to.equal(expectedId);
  });
}

async function expectDragulaCreated(formEditor) {
  let dragulaCreated = false;

  formEditor.on('dragula.created', () => {
    dragulaCreated = true;
  });

  await waitFor(() => {
    expect(dragulaCreated).to.be.true;
  });
}

function dispatchEvent(element, type, options = {}) {
  const event = document.createEvent('Event');

  event.initEvent(type, true, true);

  Object.keys(options).forEach(key => event[ key ] = options[ key ]);

  element.dispatchEvent(event);
}

function startDragging(container) {
  const formField = container.querySelector('.fjs-palette-field[data-field-type="textfield"]');
  dispatchEvent(formField, 'mousedown', { which: 1 });
}

function moveDragging(container, position) {
  const form = container.querySelector('.fjs-drag-container[data-id="Form_1"]');

  if (!position) {
    const bounds = form.getBoundingClientRect();
    position = {
      clientX: bounds.x,
      clientY: bounds.y
    };
  }

  dispatchEvent(form, 'mousemove', position);
}

function endDragging(container) {
  const form = container.querySelector('.fjs-drag-container[data-id="Form_1"]');
  dispatchEvent(form, 'mouseup');
}