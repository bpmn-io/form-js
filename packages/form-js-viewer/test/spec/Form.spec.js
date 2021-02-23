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
      data,
      schema
    });

    // then
    expect(form).to.exist;
    expect(form.reset).to.exist;
    expect(form.submit).to.exist;
    expect(form.update).to.exist;
  });


  it('should update, reset and submit', function() {

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
      data,
      schema
    });

    // update programmatically
    form.update({
      dataPath: [ 'creditor' ],
      value: 'Jane Doe Company'
    });

    // when submit
    const submission = form.submit();

    // then
    expect(submission.data).to.eql({
      creditor: 'Jane Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    });

    expect(submission.errors).to.eql({});

    // when reset
    form.reset();

    const state = form.getState();

    // then
    expect(state.data).to.eql(data);
    expect(state.errors).to.be.empty;
  });

});