import 'preact/debug';

import { Playground } from '../../src';

import schema from './form.json';

import {
  insertStyles,
  isSingleStart
} from '../TestHelper';

insertStyles();

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

    // then
    expect(playground).to.exist;

    expect(playground.getState()).to.eql({
      schema,
      data
    });
  });

});