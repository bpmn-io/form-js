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
import errorSchema from './error-form.json';

import {
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

const singleStart = isSingleStart('basic');


describe('playground', function() {

  const container = document.body;

  let playground;

  !singleStart && afterEach(function() {
    if (playground) {
      playground.destroy();
      playground = null;
    }
  });


  (singleStart ? it.only : it)('should render', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
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
      language: 'english'
    };

    // when
    playground = new Playground({
      container,
      schema,
      data
    });

    // then
    expect(playground).to.exist;

    expect(playground.getState()).to.eql({
      schema,
      data
    });

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


  it('should render properties panel (inline)', async function() {

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
    expect(domQuery('.fjs-properties-panel', editorContainer)).to.exist;
    expect(domQuery('.fjs-properties-panel', propertiesContainer)).to.not.exist;
  });


  it('should render own properties panel', async function() {

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
        editor: { inlinePropertiesPanel: false }
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


  it('should set schema', async function() {

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


  it('should handle import errors', async function() {

    // given
    await act(() => {
      playground = new Playground({
        container,
        schema
      });
    });

    // when
    let error;
    try {
      playground.setSchema(errorSchema);
    } catch (err) {
      error = err;
    }

    // then
    expect(error).to.exist;
    expect(error.message).to.eql('form field with id <foo> already exists');

    expect(error.warnings).to.exist;
    expect(error.warnings).to.be.empty;
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

});