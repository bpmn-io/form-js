import {
  render
} from '@testing-library/preact/pure';

import Label from '../../../../src/render/components/Label';

import { createFormContainer } from '../../../TestHelper';

let container;


describe('Label', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createLabel({
      id: 'foo',
      label: 'Foo'
    });

    // then
    const label = container.querySelector('.fjs-form-field-label');

    expect(label).to.exist;
    expect(label.textContent).to.eql('Foo');
  });


  it('should render children', function() {

    // when
    const { container } = createLabel({
      id: 'foo',
      label: 'Foo'
    }, <span class="foo">Foo</span>);

    // then
    const label = container.querySelector('.foo');

    expect(label).to.exist;
  });


  it('should render asterisk if required', function() {

    // when
    const { container } = createLabel({
      id: 'foo',
      label: 'Foo',
      required: true
    });

    // then
    const label = container.querySelector('.fjs-asterix');

    expect(label).to.exist;
  });


  it('should render empty also without text', function() {

    // when
    const { container } = createLabel({
      id: 'foo',
      required: true
    });

    // then
    const label = container.querySelector('.fjs-form-field-label');
    const requiredIndicator = container.querySelector('.fjs-asterix');

    expect(label).to.exist;
    expect(requiredIndicator).to.exist;
  });

});

// helpers //////////

function createLabel(options = {}, children = null) {
  const {
    id,
    label,
    required
  } = options;

  return render(
    <Label
      id={ id }
      label={ label }
      required={ required }>{ children }</Label>,
    {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}