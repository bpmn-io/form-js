import 'preact/debug';

import fileDrop from 'file-drops';

import { Playground } from '../../src';

import schema from './form.json';

import {
  insertStyles,
  insertCSS,
  isSingleStart
} from '../TestHelper';

// @ts-ignore-next-line
import playgroundCSS from '../../src/Playground.css';

// @ts-ignore-next-line
import fileDropCSS from './file-drop.css';

insertStyles();

insertCSS('Playground.css', playgroundCSS);
insertCSS('file-drop.css', fileDropCSS);

const singleStart = isSingleStart('basic');


describe('playground', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    document.body.appendChild(container);
  });

  !singleStart && afterEach(function() {
    document.body.removeChild(container);
  });


  (singleStart ? it.only : it)('should render', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      product: 'camunda-cloud',
      language: 'english'
    };

    // when
    const playground = new Playground({
      container,
      schema,
      data
    });

    const handleDrop = fileDrop('Drop a form file', function(files) {
      const file = files[0];

      if (file) {
        try {
          playground.setSchema(JSON.parse(file.contents));
        } catch (err) {

          // TODO(nikku): indicate JSON parse error
        }
      }
    });

    container.addEventListener('dragover', handleDrop);

    // then
    expect(playground).to.exist;

    expect(playground.getState()).to.eql({
      schema,
      data
    });
  });

});