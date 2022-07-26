import 'preact/debug';

import { act } from '@testing-library/preact/pure';

import {
  query as domQuery
} from 'min-dom';

import {
  Playground
} from '../../src';

import schema from './form.json';
import otherSchema from './other-form.json';

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

});