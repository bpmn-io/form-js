import { createForm } from '../../src';

import { expect } from 'chai';

import schema from './form.json';

import {
  insertStyles,
  isSingleStart
} from '../TestHelper';

insertStyles();

const singleStart = isSingleStart('basic');


describe('createForm', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    document.body.appendChild(container);
  });

  !singleStart && afterEach(function() {
    document.body.removeChild(container);
  });


  (singleStart ? it.only : it)('should render', function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    // when
    const form = createForm({
      container,
      schema,
      data
    });

    // then
    expect(form).to.exist;
    expect(form.reset).to.exist;
    expect(form.submit).to.exist;
    expect(form.update).to.exist;
  });

});