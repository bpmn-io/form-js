import 'preact/debug';

import { forEach } from 'min-dash';

import { act } from '@testing-library/preact/pure';

import {
  domify,
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import {
  Playground
} from '../../src';

import schema from './form.json';
import otherSchema from './other-form.json';
import rowsSchema from './rows-form.json';
import customSchema from './custom.json';

import { CustomFormFieldsModule } from '../custom/viewer';
import { CustomPropertiesProviderModule } from '../custom/editor';
import customStyles from '../custom/styles.css';

import {
  expectNoViolations,
  insertCSS,
  isSingleStart
} from '../TestHelper';

insertCSS('Test.css', `
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
`);

insertCSS('custom.css', customStyles);

const singleStartBasic = isSingleStart('basic');
const singleStartRows = isSingleStart('rows');
const singleStartCustom = isSingleStart('custom');
const singleStart = singleStartBasic || singleStartRows || singleStartCustom;


describe('playground', function() {

  const container = document.body;

  let playground;

  !singleStart && afterEach(function() {
    if (playground) {
      playground.destroy();
      playground = null;
    }
  });


  (singleStartBasic ? it.only : it)('should render', async function() {

    // given
    this.timeout(10000);

    const data = {
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160px' viewBox='0 0 58 23'%3E%3Cpath fill='currentColor' d='M7.75 3.8v.58c0 1.7-.52 2.78-1.67 3.32C7.46 8.24 8 9.5 8 11.24v1.34c0 2.54-1.35 3.9-3.93 3.9H0V0h3.91c2.68 0 3.84 1.25 3.84 3.8zM2.59 2.35V6.7H3.6c.97 0 1.56-.42 1.56-1.74v-.92c0-1.18-.4-1.7-1.32-1.7zm0 6.7v5.07h1.48c.87 0 1.34-.4 1.34-1.63v-1.43c0-1.53-.5-2-1.67-2H2.6zm14.65-4.98v2.14c0 2.64-1.27 4.08-3.87 4.08h-1.22v6.2H9.56V0h3.82c2.59 0 3.86 1.44 3.86 4.07zm-5.09-1.71v5.57h1.22c.83 0 1.28-.37 1.28-1.55V3.91c0-1.18-.45-1.56-1.28-1.56h-1.22zm11.89 9.34L25.81 0h3.6v16.48h-2.44V4.66l-1.8 11.82h-2.45L20.8 4.83v11.65h-2.26V0h3.6zm9.56-7.15v11.93h-2.33V0h3.25l2.66 9.87V0h2.31v16.48h-2.66zm10.25 9.44v2.5h-2.5v-2.5zM50 4.16C50 1.52 51.38.02 53.93.02c2.54 0 3.93 1.5 3.93 4.14v8.37c0 2.64-1.4 4.14-3.93 4.14-2.55 0-3.93-1.5-3.93-4.14zm2.58 8.53c0 1.18.52 1.63 1.35 1.63.82 0 1.34-.45 1.34-1.63V4c0-1.17-.52-1.62-1.34-1.62-.83 0-1.35.45-1.35 1.62zM0 18.7h57.86V23H0zM45.73 0h2.6v2.58h-2.6zm2.59 16.48V4.16h-2.59v12.32z'%3E%3C/path%3E%3C/svg%3E",
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      approverComments: 'This invoice looks good.\nOr so I think anyways.',
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      dri: 'johnDoe',
      hobbies: [ 'sports', 'books', 'dancing' ],
      queriedDRIs: [
        {
          'label': 'John Doe',
          'value': 'johnDoe'
        },
        {
          'label': 'Anna Bell',
          'value': 'annaBell'
        },
        {
          'label': 'Nico Togin',
          'value': 'incognito'
        }
      ],
      tags: [ 'tag1', 'tag2', 'tag3' ],
      conversation: '2010-06-06T12:00Z',
      language: 'english'
    };

    // when
    await act(() => {
      playground = new Playground({
        container,
        schema,
        data
      });
    });

    const formEditor = playground.getEditor();

    formEditor.on('changed', event => {
      console.log('Form Editor <changed>', event, formEditor.getSchema());
    });

    // then
    expect(playground).to.exist;
  });


  (singleStartRows ? it.only : it)('should render', async function() {

    // given
    const data = {
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      approverComments: 'This invoice looks good.\nOr so I think anyways.'
    };

    // when
    playground = new Playground({
      container,
      schema: rowsSchema,
      data
    });

    // then
    expect(playground).to.exist;

  });


  (singleStartCustom ? it.only : it)('should support custom element', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 25
    };

    // when
    // viewer and editor
    playground = new Playground({
      container,
      schema: customSchema,
      data,
      additionalModules: [
        CustomFormFieldsModule
      ],
      editorAdditionalModules: [
        CustomPropertiesProviderModule
      ]
    });

    // then
    expect(playground).to.exist;
  });


  it('should append sample data', async function() {

    // given
    const attrs = {
      id: 'table',
      type: 'table',
      dataSource: '=table',
      columns: [
        {
          key: 'id',
          label: 'ID'
        },
        {
          key: 'name',
          label: 'Name'
        },
        {
          key: 'date',
          label: 'Date'
        }
      ]
    };

    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    const editor = playground.getEditor();
    const modeling = editor.get('modeling');

    // when
    await act(() => {
      const { schema } = editor._getState();
      modeling.addFormField(attrs, schema, 0);
    });

    // then
    const dataEditor = playground.getDataEditor();

    const inputData = JSON.parse(dataEditor.getValue());

    expect(inputData).to.have.property('table');
    expect(inputData.table).to.eql([
      { id: 1, name: 'John Doe', date: '31.01.2023' },
      { id: 2, name: 'Erika Muller', date: '20.02.2023' },
      { id: 3, name: 'Dominic Leaf', date: '11.03.2023' }
    ]);
  });

  it('should not append sample data', async function() {

    // given
    const attrs = {
      id: 'table',
      type: 'table',
      dataSource: '=table',
      columnsExpression: '=peopleColumns'
    };

    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    const editor = playground.getEditor();
    const modeling = editor.get('modeling');

    // when
    await act(() => {
      const { schema } = editor._getState();
      modeling.addFormField(attrs, schema, 0);
    });

    // then
    const dataEditor = playground.getDataEditor();

    expect(dataEditor.getValue()).to.be.empty;
  });


  it('should NOT attach to empty parent', async function() {

    // given
    const data = {
      creditor: 'foo'
    };

    // when
    await act(() => {
      new Playground({
        schema,
        data
      });
    });

    const playgroundContainer = domQuery('.fjs-pgl-root', container);

    // then
    expect(domQuery('.fjs-properties-panel', playgroundContainer)).to.not.exist;
  });


  it('should render actions', async function() {

    // given
    const data = {
      creditor: 'foo'
    };

    // when
    await act(() => {
      playground = new Playground({
        container,
        schema,
        data
      });
    });

    const actions = domQueryAll('.fjs-pgl-button', container);

    // then
    expect(actions.length).to.eql(2);
  });


  it('should NOT render actions', async function() {

    // given
    const data = {
      creditor: 'foo'
    };

    // when
    await act(() => {
      playground = new Playground({
        container,
        schema,
        data,
        actions: { display: false }
      });
    });

    const actions = domQueryAll('.fjs-pgl-button', container);

    // then
    expect(actions.length).to.eql(0);
  });


  it('should render properties panel', async function() {

    // given
    const data = {
      creditor: 'foo'
    };

    // when
    await act(() => {
      playground = new Playground({
        container,
        schema,
        data
      });
    });

    const editorContainer = domQuery('.fjs-form-editor', container);
    const propertiesContainer = domQuery('.fjs-pgl-properties-container', container);

    // then
    expect(domQuery('.fjs-properties-panel', editorContainer)).to.not.exist;
    expect(domQuery('.fjs-properties-panel', propertiesContainer)).to.exist;
  });


  it('should render own palette', async function() {

    // given
    const data = {
      creditor: 'foo'
    };

    // when
    await act(() => {
      playground = new Playground({
        container,
        schema,
        data
      });
    });

    const editorContainer = domQuery('.fjs-form-editor', container);
    const paletteContainer = domQuery('.fjs-pgl-palette-container', container);

    // then
    expect(domQuery('.fjs-palette', editorContainer)).to.not.exist;
    expect(domQuery('.fjs-palette', paletteContainer)).to.exist;
  });


  it('should configure exporter', async function() {

    // given
    const exporter = {
      name: 'Foo',
      version: 'bar'
    };

    // when
    await act(() => {
      playground = new Playground({
        container,
        schema,
        exporter
      });
    });

    const editor = playground.getEditor();

    // then
    expect(editor.exporter).to.eql(exporter);
  });


  it('#setSchema', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    // when
    await act(() => playground.setSchema(otherSchema));

    // then
    expect(playground.getState().schema).to.deep.include(otherSchema);
  });


  it('should not blow up on empty schema', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container
      });
    });

    // then
    expect(playground.getState().schema).to.be.undefined;
  });


  it('#getSchema', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    await act(() => playground.setSchema(otherSchema));

    // then
    expect(playground.getSchema()).to.deep.include(otherSchema);
  });


  it('#saveSchema', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    await act(() => playground.setSchema(otherSchema));

    // then
    expect(playground.saveSchema()).to.deep.include(otherSchema);
  });


  it('#get', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    // when
    const eventBus = playground.get('eventBus');

    // then
    expect(eventBus).to.exist;
  });


  it('#getDataEditor', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    // when
    const dataEditor = playground.getDataEditor();

    // then
    expect(dataEditor).to.exist;
    expect(dataEditor.getValue).to.exist;
  });


  it('#getEditor', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    // when
    const editor = playground.getEditor();

    // then
    expect(editor).to.exist;
    expect(editor.on).to.exist;
    expect(editor.off).to.exist;
  });


  it('#getForm', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    // when
    const form = playground.getForm();

    // then
    expect(form).to.exist;
    expect(form.submit).to.exist;
  });


  it('#getResultView', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    // when
    const resultView = playground.getResultView();

    // then
    expect(resultView).to.exist;
    expect(resultView.getValue).to.exist;
  });


  it('should set aria-label attributes', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    // then
    expect(domQuery('[aria-label="Form Definition"]', container)).to.exist;
    expect(domQuery('[aria-label="Form Preview"]', container)).to.exist;
    expect(domQuery('[aria-label="Form Input"]', container)).to.exist;
    expect(domQuery('[aria-label="Form Output"]', container)).to.exist;
  });


  describe('form data submit', function() {

    it('should show submit data', async function() {

      // given
      const data = {
        creditor: 'foo',
        invoiceNumber: 'C-123'
      };

      await act(() => {
        playground = new Playground({
          container,
          data,
          schema
        });
      });

      const form = playground.getForm();
      const resultView = playground.getResultView();

      const resultViewValue = JSON.parse(resultView.getValue());

      // when
      const { data: submitData } = form.submit();

      // then
      expect(resultViewValue).to.eql(submitData);
    });


    it('should update with submit data', async function() {

      // given
      const data = {
        creditor: 'foo',
        invoiceNumber: 'C-123'
      };

      await act(() => {
        playground = new Playground({
          container,
          data,
          schema
        });
      });

      const form = playground.getForm();
      const resultView = playground.getResultView();

      const formField = getFormField(form, 'creditor');

      // when
      await act(() => {
        form._update({
          field: formField,
          value: 'bar'
        });
      });

      const resultViewValue = JSON.parse(resultView.getValue());

      const { data: submitData } = form.submit();

      // then
      expect(resultViewValue).to.eql(submitData);
    });

  });


  describe('event emitting', function() {

    it('should emit <formPlayground.rendered>', async function() {

      // given
      const spy = sinon.spy();

      await act(() => {
        playground = new Playground({
          container,
          schema
        });
      });

      playground.on('formPlayground.rendered', spy);

      const eventBus = playground.get('eventBus');

      // when
      eventBus.fire('formEditor.rendered');

      // then
      expect(spy).to.have.been.called;
    });


    it.skip('should emit <formPlayground.init>', async function() {

      // given
      const spy = sinon.spy();

      await act(() => {
        playground = new Playground({
          container,
          schema
        });
      });

      playground.on('formPlayground.init', spy);

      // when
      await act(() => {
        playground.setSchema(otherSchema);
      });

      // then
      expect(spy).to.have.been.called;
    });


    it('should emit <formPlayground.inputDataError>', async function() {

      // given
      await act(() => {
        playground = new Playground({
          container,
          schema
        });
      });

      let trackedError;

      playground.on('formPlayground.inputDataError', e => trackedError = e);

      // when
      await act(() => {
        const dataEditor = playground.getDataEditor();
        dataEditor.emit('changed', { value: 'foo' });
      });

      // then
      expect(trackedError).to.exist;
      expect(trackedError.name).to.eql('SyntaxError');
    });

  });


  describe('attach components', function() {

    /**
     * @typedef { {
     *   name: String,
     *   attachFn: String,
     *   selector: String
     * } } PlaygroundComponent
     */

    /** @type Array<PlaygroundComponent> */
    const components = [
      {
        name: 'editor',
        attachFn: 'attachEditorContainer',
        selector: 'fjs-form-editor'
      },
      {
        name: 'preview',
        attachFn: 'attachPreviewContainer',
        selector: 'fjs-form'
      },
      {
        name: 'data',
        attachFn: 'attachDataContainer',
        selector: 'cm-editor'
      },
      {
        name: 'result',
        attachFn: 'attachResultContainer',
        selector: 'cm-editor'
      },
      {
        name: 'palette',
        attachFn: 'attachPaletteContainer',
        selector: 'fjs-palette-container'
      },
      {
        name: 'properties-panel',
        attachFn: 'attachPropertiesPanelContainer',
        selector: 'fjs-properties-panel'
      },
    ];

    forEach(components, ({ name, attachFn, selector }) => {

      describe(`attach ${name}`, function() {

        let parent;

        beforeEach(function() {
          parent = domify(`<div class="${name}"></div>`);
          document.body.appendChild(parent);
        });

        afterEach(function() {
          document.body.removeChild(parent);
        });


        it(`should throw when not initialized - ${name}`, async function() {

          // given
          playground = new Playground({
            container,
            schema
          });

          // then
          expect(() => playground[attachFn](parent)).to.throw('Playground is not initialized.');
        });


        it(`should attach ${name}`, async function() {

          // given
          await act(() => {
            playground = new Playground({
              container,
              schema
            });
          });

          // when
          await act(() => {
            playground[attachFn](parent);
          });

          const expectedContainer = domQuery(`.${selector}`, parent);

          // then
          expect(expectedContainer).to.exist;
        });

      });

    });


    describe('complex (attach alltogether)', function() {

      let testContainer;

      beforeEach(function() {
        testContainer = document.createElement('div');
        document.body.appendChild(testContainer);
      });

      afterEach(function() {
        document.body.removeChild(testContainer);
      });


      it('should attach', async function() {

        // given
        const withParent = components.map(component => {
          const parent = domify(`<div class="${component.name}"></div>`);
          testContainer.appendChild(parent);
          return {
            ...component,
            parent
          };
        });

        const data = {
          creditor: 'foo'
        };

        let playground;
        await act(() => {
          playground = new Playground({
            schema,
            data,
            editor: { inlinePropertiesPanel: false }
          });
        });

        // when
        await act(() => {
          forEach(withParent, ({ attachFn, parent }) => {
            playground[attachFn](parent);
          });
        });

        // then
        forEach(components, ({ selector, parent }) => {
          expect(domQuery(`.${selector}`, parent)).to.exist;
        });

      });

    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const main = document.createElement('main');
      container.appendChild(main);

      const data = {
        logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160px' viewBox='0 0 58 23'%3E%3Cpath fill='currentColor' d='M7.75 3.8v.58c0 1.7-.52 2.78-1.67 3.32C7.46 8.24 8 9.5 8 11.24v1.34c0 2.54-1.35 3.9-3.93 3.9H0V0h3.91c2.68 0 3.84 1.25 3.84 3.8zM2.59 2.35V6.7H3.6c.97 0 1.56-.42 1.56-1.74v-.92c0-1.18-.4-1.7-1.32-1.7zm0 6.7v5.07h1.48c.87 0 1.34-.4 1.34-1.63v-1.43c0-1.53-.5-2-1.67-2H2.6zm14.65-4.98v2.14c0 2.64-1.27 4.08-3.87 4.08h-1.22v6.2H9.56V0h3.82c2.59 0 3.86 1.44 3.86 4.07zm-5.09-1.71v5.57h1.22c.83 0 1.28-.37 1.28-1.55V3.91c0-1.18-.45-1.56-1.28-1.56h-1.22zm11.89 9.34L25.81 0h3.6v16.48h-2.44V4.66l-1.8 11.82h-2.45L20.8 4.83v11.65h-2.26V0h3.6zm9.56-7.15v11.93h-2.33V0h3.25l2.66 9.87V0h2.31v16.48h-2.66zm10.25 9.44v2.5h-2.5v-2.5zM50 4.16C50 1.52 51.38.02 53.93.02c2.54 0 3.93 1.5 3.93 4.14v8.37c0 2.64-1.4 4.14-3.93 4.14-2.55 0-3.93-1.5-3.93-4.14zm2.58 8.53c0 1.18.52 1.63 1.35 1.63.82 0 1.34-.45 1.34-1.63V4c0-1.17-.52-1.62-1.34-1.62-.83 0-1.35.45-1.35 1.62zM0 18.7h57.86V23H0zM45.73 0h2.6v2.58h-2.6zm2.59 16.48V4.16h-2.59v12.32z'%3E%3C/path%3E%3C/svg%3E",
        invoiceNumber: 'C-123',
        approved: true,
        approvedBy: 'John Doe',
        approverComments: 'This invoice looks good.\nOr so I think anyways.',
        mailto: [ 'regional-manager', 'approver' ],
        product: 'camunda-cloud',
        dri: 'johnDoe',
        hobbies: [ 'sports', 'books', 'dancing' ],
        queriedDRIs: [
          {
            'label': 'John Doe',
            'value': 'johnDoe'
          },
          {
            'label': 'Anna Bell',
            'value': 'annaBell'
          },
          {
            'label': 'Nico Togin',
            'value': 'incognito'
          }
        ],
        tags: [ 'tag1', 'tag2', 'tag3' ],
        conversation: '2010-06-06T12:00Z',
        language: 'english'
      };

      // when
      await act(() => {
        playground = new Playground({
          container: main,
          schema,
          data
        });
      });

      // then
      await expectNoViolations(container);
    });

  });
});


// helper //////////////

function getFormField(form, key) {
  return form.get('formFieldRegistry').getAll().find((formField) => formField.key === key);
}