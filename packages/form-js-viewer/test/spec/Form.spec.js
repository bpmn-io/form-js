import { createForm } from '../../src';

import { expect } from 'chai';

import { spy } from 'sinon';

import { waitFor } from '@testing-library/preact/pure';

import schema from './form.json';

import {
  isSingleStart
} from '../TestHelper';

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


  (singleStart ? it.only : it)('should render', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    // when
    const form = await waitForFormCreated({
      container,
      data,
      schema
    });

    form.on('changed', ({ data, errors }) => console.log(data, errors));

    // then
    expect(form).to.exist;
    expect(form.reset).to.exist;
    expect(form.submit).to.exist;
    expect(form.update).to.exist;
  });


  it('should update, reset and submit', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    // when
    const form = await waitForFormCreated({
      container,
      data,
      schema
    });

    // update programmatically
    form.update({
      path: [ 'creditor' ],
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


  it('should emit <changed>', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    const form = await waitForFormCreated({
      container,
      data,
      schema
    });

    const changedListener = spy(function(event) {

      expect(event).to.have.keys([
        'data',
        'errors',
        'schema',
        'properties'
      ]);

      expect(event.data.creditor).to.eql('Jane Doe Company');
    });

    form.on('changed', changedListener);

    // when
    form.update({
      path: [ 'creditor' ],
      value: 'Jane Doe Company'
    });

    // then
    expect(changedListener).to.have.been.calledOnce;
  });


  it('should emit <submit>', async function() {

    // given
    const data = {
      amount: 456
    };

    const form = await waitForFormCreated({
      container,
      data,
      schema
    });

    const submitListener = spy(function(event) {

      expect(event).to.have.keys([
        'data',
        'errors'
      ]);

      expect(event.errors).to.eql({
        creditor: [ 'Field is required.' ]
      });

      expect(event.data).to.eql(data);
    });

    form.on('submit', submitListener);

    // when
    form.submit();
  });

});

async function waitForFormCreated(options) {
  const form = createForm(options);

  await waitFor(() => {
    expect(form.fields.size).to.equal(6);
  });

  return form;
}