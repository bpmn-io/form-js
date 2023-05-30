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
  insertTheme,
  isSingleStart,
  expectNoViolations
} from '../TestHelper';

import schema from './form.json';
import schemaNoIds from './form-no-ids.json';
import schemaRows from './form-rows.json';

insertStyles();

const spy = sinon.spy;

const singleStartBasic = isSingleStart('basic');
const singleStartRows = isSingleStart('rows');
const singleStartTheme = isSingleStart('theme');

const singleStart = singleStartBasic || singleStartRows || singleStartTheme;


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

  (singleStartBasic ? it.only : it)('should render', async function() {

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


  (singleStartRows ? it.only : it)('should render rows layout', async function() {

    // when
    formEditor = await createFormEditor({
      container,
      schema: schemaRows,
      keyboard: {
        bindTo: document
      },
      debugColumns: true
    });

    formEditor.on('changed', event => {
      console.log('Form Editor <changed>', event, formEditor.getSchema());
    });

    // then
    expect(formEditor.get('formFieldRegistry').getAll()).to.have.length(8);
  });


  (singleStartTheme ? it.only : it)('should render theme', async function() {

    // given
    container.classList.add('cds--g100');
    insertTheme();

    // when
    formEditor = await createFormEditor({
      container,
      schema,
      keyboard: {
        bindTo: document
      }
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

      formEditor = new FormEditor();

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
    formEditor = await createFormEditor({
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
      const paletteContainer = domQuery('.fjs-palette-container', container);

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


    it('should move form field', async function() {

      // given
      formEditor = await createFormEditor({
        schema: schemaRows,
        container
      });

      const formFieldRegistry = formEditor.get('formFieldRegistry');

      await expectDragulaCreated(formEditor);

      // assume
      expectLayout(formFieldRegistry.get('Textfield_1'), {
        columns: 8,
        row: 'Row_1'
      });

      const formField = container.querySelector('[data-id="Textfield_1"]').parentNode;

      const row = container.querySelector('[data-row-id=Row_4]');
      const bounds = row.getBoundingClientRect();

      // when
      startDragging(container, formField);
      moveDragging(container, {
        clientX: bounds.x + 10,
        clientY: bounds.y + 10
      });

      endDragging(container);

      // then
      expectLayout(formFieldRegistry.get('Textfield_1'), {
        columns: 8,
        row: 'Row_4'
      });
    });


    it('should NOT move form field - invalid', async function() {

      // given
      formEditor = await createFormEditor({
        schema: schemaRows,
        container
      });

      const formFieldRegistry = formEditor.get('formFieldRegistry');

      await expectDragulaCreated(formEditor);

      // assume
      expectLayout(formFieldRegistry.get('Textfield_1'), {
        columns: 8,
        row: 'Row_1'
      });

      const formField = container.querySelector('[data-id="Textfield_1"]').parentNode;

      const row = container.querySelector('[data-row-id=Row_2]');
      const bounds = row.getBoundingClientRect();

      // when
      startDragging(container, formField);
      moveDragging(container, {
        clientX: bounds.x + 10,
        clientY: bounds.y + 10
      });
      endDragging(container);

      // then
      expectLayout(formFieldRegistry.get('Textfield_1'), {
        columns: 8,
        row: 'Row_1'
      });
    });


    // flaky, skipped for now until we migrate it to playwright
    it.skip('should move row', async function() {

      // given
      formEditor = await createFormEditor({
        schema: schemaRows,
        container
      });

      await expectDragulaCreated(formEditor);

      // assume
      expect(getRowOrder(container)).to.eql([
        'Row_1',
        'Row_2',
        'Row_3',
        'Row_4'
      ]);

      const row = container.querySelector('[data-row-id="Row_1"]');
      const rowDragger = row.parentNode.querySelector('.fjs-row-dragger');

      const otherRow = container.querySelector('[data-row-id="Row_2"]');
      const bounds = otherRow.getBoundingClientRect();

      // when
      startDragging(container, rowDragger);
      moveDragging(container, {
        clientX: bounds.x,
        clientY: bounds.y
      });

      endDragging(container);

      // then
      expect(getRowOrder(container)).to.eql([
        'Row_2',
        'Row_1',
        'Row_3',
        'Row_4'
      ]);
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


  describe('resize', function() {

    function expectResized(test, fieldId, direction, prevCols, deltaCols, newCols, undo) {

      it(test, async function() {

        // given
        formEditor = await createFormEditor({
          schema: schemaRows,
          container
        });

        const formFieldRegistry = formEditor.get('formFieldRegistry');

        const field = formFieldRegistry.get(fieldId);

        formEditor.get('selection').set(field);

        await expectSelected(fieldId);

        // assume
        expectLayout(field, {
          columns: prevCols,
          row: field.layout.row
        });

        const formFieldNode = container.querySelector(`[data-id="${fieldId}"]`).parentNode;

        const rowNode = getRowParent(formFieldNode);

        const resizer = formFieldNode.querySelector(`.fjs-field-resize-handle-${direction}`);
        const bounds = resizer.getBoundingClientRect();

        // when
        startResizing(resizer);
        moveResizing(resizer, {
          clientX: bounds.x + asPixels(deltaCols, rowNode),
          clientY: bounds.y
        });
        endResizing(resizer);

        // then
        expectLayout(formFieldRegistry.get(fieldId), {
          columns: newCols,
          row: field.layout.row
        });

        // and when
        if (undo) {
          formEditor.get('commandStack').undo();

          // then
          expectLayout(formFieldRegistry.get(fieldId), {
            columns: prevCols,
            row: field.layout.row
          });
        }
      });
    }


    it('render resize handles', async function() {

      // given
      formEditor = await createFormEditor({
        schema,
        container
      });

      const field = formEditor.get('formFieldRegistry').get('Textfield_1');

      // when
      formEditor.get('selection').set(field);

      await expectSelected('Textfield_1');

      const formFieldNode = container.querySelector('[data-id="Textfield_1"]').parentNode;

      // then
      expect(formFieldNode.querySelector('.fjs-field-resize-handle-right')).to.exist;
      expect(formFieldNode.querySelector('.fjs-field-resize-handle-left')).to.exist;
    });


    expectResized(
      'should resize form field - right, decrease',
      'Textfield_1',
      'right',
      8, -2, 6
    );


    expectResized(
      'should resize form field - right, increase',
      'Radio_1',
      'right',
      8, 2, 10
    );


    expectResized(
      'should resize form field - left, decrease',
      'Textfield_1',
      'left',
      8, 2, 6
    );


    expectResized(
      'should resize form field - left, increase',
      'Radio_1',
      'left',
      8, -2, 10
    );


    expectResized(
      'should NOT resize form field - invalid, no more cols left',
      'Textfield_1',
      'right',
      8, 4, 8
    );


    expectResized(
      'should NOT resize form field - max cols reached',
      'Textfield_1',
      'right',
      8, 20, 8
    );


    expectResized(
      'should NOT resize form field - min cols reached',
      'Textfield_1',
      'right',
      8, -8, 8
    );


    expectResized(
      'should resize form field - undo',
      'Radio_1',
      'right',
      8, 2, 10,
      true
    );

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      await createFormEditor({
        schema,
        container
      });

      // then
      // @Note(pinussilvestrus): the palette entries are currently
      // not keyboard accessible, as we need to invest in an overall
      // editor keyboard experience
      // cf. https://github.com/bpmn-io/form-js/issues/536
      await expectNoViolations(container, {
        rules: {
          'scrollable-region-focusable': {
            enabled: false
          }
        }
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

function expectLayout(field, layout) {
  expect(field.layout).to.eql(layout);
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

function startResizing(node, position) {
  if (!position) {
    const bounds = node.getBoundingClientRect();
    position = {
      clientX: bounds.x,
      clientY: bounds.y
    };
  }

  dispatchEvent(node, 'dragstart', position);
}

function moveResizing(node, position) {
  dispatchEvent(node, 'dragover', position);
}

function endResizing(node) {
  dispatchEvent(node, 'dragend');
}

function startDragging(container, node) {
  if (!node) {
    node = container.querySelector('.fjs-palette-field[data-field-type="textfield"]');
  }

  dispatchEvent(node, 'mousedown', { which: 1 });
}

function moveDragging(container, position) {
  const form = container.querySelector('.fjs-drop-container-vertical[data-id="Form_1"]');

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
  const form = container.querySelector('.fjs-drop-container-vertical[data-id="Form_1"]');
  dispatchEvent(form, 'mouseup');
}

function getRowOrder(container) {
  const order = [];

  const rows = container.querySelectorAll('.fjs-layout-row');
  rows.forEach(r => order.push(r.dataset.rowId));

  return order;
}

function asPixels(columns, parent) {
  const totalWidth = parent.getBoundingClientRect().width;

  const oneColumn = (1 / 16) * totalWidth;

  return Math.round(columns * oneColumn);
}

function getRowParent(node) {
  return node.closest('.fjs-layout-row');
}