import { render } from '@testing-library/preact/pure';

import Fieldset from '../../../../../src/render/components/form-fields/Fieldset';

import { createFormContainer } from '../../../../TestHelper';

let container;

describe('Fieldset', function() {
  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });

  it('should render', function() {

    // when
    const { container } = createFieldsetField();

    const label = container.querySelector('legend');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Default');
  });
});

// helpers //////////

const defaultField = {
  label: 'Default',
  type: 'fieldset',
};

function createFieldsetField(options = {}) {
  const { field = defaultField } = options;

  return render(<Fieldset field={ field } />, {
    container: options.container || container.querySelector('.fjs-form'),
  });
}
