import {
  createForm,
  schemaVersion
} from '../../src';

import { spy } from 'sinon';

import { waitFor } from '@testing-library/preact/pure';

import customModule from './custom';

import schema from './form.json';

import {
  insertCSS,
  isSingleStart
} from '../TestHelper';

// @ts-ignore-next-line
import customCSS from './custom/custom.css';

insertCSS('custom.css', customCSS);

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


  it('should expose schemaVersion', function() {
    expect(typeof schemaVersion).to.eql('number');
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
    expect(form._update).to.exist;
  });


  it('#destroy', async function() {

    // given
    const form = await waitForFormCreated({
      container,
      schema
    });

    // when
    form.destroy();

    // then
    expect(container.childNodes).to.be.empty;
  });


  it('should attach', async function() {

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
    const form = await waitForFormCreated({
      data,
      schema
    });

    // assume
    expect(form._container.parentNode).not.to.exist;

    // when
    form.attachTo(container);

    // then
    expect(form._container.parentNode).to.exist;
  });


  it('should detach', async function() {

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
    const form = await waitForFormCreated({
      container,
      data,
      schema
    });

    // assume
    expect(form._container.parentNode).to.exist;

    // when
    form.detach();

    // then
    expect(form._container.parentNode).not.to.exist;
  });


  it('should be customizable', async function() {

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
    await waitForFormCreated({
      container,
      data,
      schema,
      additionalModules: [
        customModule
      ]
    });

    // then
    expect(document.querySelector('.custom-button')).to.exist;
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
    form._update({
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

    const state = form._getState();

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

      expect(event.data).to.exist;
      expect(event.errors).to.exist;
      expect(event.properties).to.exist;
      expect(event.schema).to.exist;

      expect(event.data.creditor).to.eql('Jane Doe Company');
    });

    form.on('changed', changedListener);

    // when
    form._update({
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

      expect(event.data).to.exist;
      expect(event.errors).to.exist;

      expect(event.errors).to.eql({
        creditor: [ 'Field is required.' ]
      });

      expect(event.data).to.eql(data);
    });

    form.on('submit', submitListener);

    // when
    form.submit();
  });


  describe('error handling', function() {

    // TODO: fix, will only blow up on async rendering
    it.skip('should throw on unknown field', function() {

      // given
      const data = {
        creditor: 'John Doe Company',
        amount: 456,
        invoiceNumber: 'C-123',
        approved: true,
        approvedBy: 'John Doe'
      };

      const schema = {
        type: 'default',
        components: [
          {
            type: 'unknown-field'
          }
        ]
      };

      let error;

      // when
      try {
        createForm({
          container,
          data,
          schema
        });
      } catch (err) {
        error = err;
      }

      // then
      // error indicates problem
      expect(error).to.exist;
      expect(error.message).to.match(/cannot render field <unknown-field>/);

      // and nothing is rendered
      expect(container.childNodes).to.be.empty;
    });
  });

});


async function waitForFormCreated(options) {
  const form = createForm(options);

  await waitFor(() => {
    expect(form.get('formFieldRegistry').size).to.equal(11);
  });

  return form;
}