import { render } from '@testing-library/preact/pure';

import { Separator } from '../../../../../src/render/components/form-fields/Separator';

import {
  createFormContainer
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

let container;


describe('Separator', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });

  it('should render', function() {

    // when
    const { container } = createSeparator();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-separator')).to.be.true;

    const separator = formField.querySelector('hr');
    expect(separator).to.exist;

  });

});

// helpers //////////

const defaultField = {
  type: 'separator'
};

function createSeparator({ services, ...restOptions } = {}) {

  const options = {
    domId: 'test-separator',
    field: defaultField,
    onChange: () => {},
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      field={ options.field }
    >
      <Separator field={ options.field } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}
