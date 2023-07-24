import { render } from '@testing-library/preact/pure';

import Spacer from '../../../../../src/render/components/form-fields/Spacer';

import {
  createFormContainer
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

let container;


describe('Spacer', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });

  it('should render', function() {

    // when
    const { container } = createSpacer();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-spacer')).to.be.true;
  });


  it('should accept custom height', function() {

    // when
    const { container } = createSpacer({
      field: {
        height: 20,
        type: 'spacer'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.style.height).to.eql('20px');
  });

});

// helpers //////////

const defaultField = {
  type: 'spacer'
};

function createSpacer(options = {}) {
  const {
    data = {},
    initialData = {},
    properties = {},
    field = defaultField
  } = options;

  return render(WithFormContext(
    <Spacer field={ field }
    />,
    {
      ...options,
      properties,
      initialData,
      data
    }
  ),
  {
    container: options.container || container.querySelector('.fjs-form')
  });
}
