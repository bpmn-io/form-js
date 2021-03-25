import { createFormEditor } from '../../src';

import { expect } from 'chai';

import schema from './form.json';

import { insertStyles } from '../TestHelper';

insertStyles();


describe('createFormEditor', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');

    document.body.appendChild(container);
  });


  it('should render', function() {

    // when
    const formEditor = createFormEditor({
      container,
      schema
    });

    // then
    expect(formEditor).to.exist;
  });

});