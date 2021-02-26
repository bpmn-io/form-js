import { createForm } from '../../src';

import { expect } from 'chai';

import { spy } from 'sinon';

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


  it('should emit <changed>', function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe'
    };

    const form = createForm({
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
      dataPath: [ 'creditor' ],
      value: 'Jane Doe Company'
    });

    // then
    expect(changedListener).to.have.been.calledOnce;
  });


  it('should emit <submit>', function() {

    // given
    const data = {
      amount: 456
    };

    const form = createForm({
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

    // then
    expect(submitListener).to.have.been.calledOnce;
  });

});