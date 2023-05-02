import {
  createForm,
  schemaVersion,
  Form
} from '../../src';

import schema from './form.json';

import {
  insertStyles,
  isSingleStart
} from '../TestHelper';

import {
  expect
} from 'chai';


insertStyles();

const singleStart = isSingleStart('basic');

describe('viewer exports', function() {

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
      approverComments: 'Please review this approval in the next quarter',
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      tags: [ 'tag1', 'tag2', 'tag3' ],
      language: 'english'
    };

    // when
    const form = await createForm({
      container,
      schema,
      data
    });

    // then
    expect(form).to.exist;
    expect(form.reset).to.exist;
    expect(form.submit).to.exist;
    expect(form._update).to.exist;
  });


  it('should instantiate + render', async function() {

    // given
    const data = {
      creditor: 'John Doe Company',
      amount: 456,
      invoiceNumber: 'C-123',
      approved: true,
      approvedBy: 'John Doe',
      approverComments: 'Please review this approval in the next quarter',
      mailto: [ 'regional-manager', 'approver' ],
      product: 'camunda-cloud',
      tags: [ 'tag1', 'tag2', 'tag3' ],
      language: 'english'
    };

    // when
    const form = new Form({ container });

    await form.importSchema(schema, data);

    // then
    expect(form).to.exist;
    expect(form.reset).to.exist;
    expect(form.submit).to.exist;
    expect(form._update).to.exist;
  });


  it('should import schema without IDs', async function() {

    // given
    const schema = {
      type: 'default',
      schemaVersion,
      components: [
        {
          type: 'number',
          key: 'number'
        }
      ]
    };

    const form = new Form({ container });

    // when
    await form.importSchema(schema);

    // then
    const fieldRegistry = form.get('formFieldRegistry');

    expect(fieldRegistry.getAll()).to.have.length(2);

    fieldRegistry.forEach(function(field) {
      expect(field).to.have.property('id');
    });
  });


  it('should expose schemaVersion', function() {
    expect(typeof schemaVersion).to.eql('number');

    expect(schemaVersion).to.eql(9);
  });


  it('should generate unique ID for every instance', async function() {

    // given
    const schema = {
      components: [
        {
          id: 'Text_1',
          type: 'textfield'
        }
      ],
      id: 'Form_1',
      type: 'default'
    };

    // when
    const form = await createForm({
      container,
      schema
    });

    // then
    expect(form._id).to.exist;
  });

});