import 'preact/debug';

import { Playground } from '../../src';
import { insertCSS, isSingleStart } from '../TestHelper';
import schema from './form.json';
import otherSchema from './other-form.json';

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
      product: 'camunda-cloud',
      language: 'english',
      options: [
        { label: 'Label1', value: 'Value1' },
        { label: 'Label2', value: 'Value2' }
      ]
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


  it.skip('should set schema', function() {

    // given
    const playground = new Playground({
      container,
      schema
    });

    // when
    playground.setSchema(otherSchema);

    // then
    expect(playground.getState()).to.eql({
      schema: otherSchema,
      data: {}
    });

  });

});