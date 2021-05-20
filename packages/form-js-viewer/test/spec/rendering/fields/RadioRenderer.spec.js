import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import RadioRenderer from '../../../../src/rendering/fields/RadioRenderer';

import { createFormContainer } from '../../../TestHelper';

const spy = sinon.spy;

let container;


describe('RadioRenderer', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createRadio({
      value: 'camunda-platform'
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-radio')).to.be.true;

    const inputs = container.querySelectorAll('input[type="radio"]');

    expect(inputs).to.have.length(2);

    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Product');
  });


  it('should render default value (undefined)', function() {

    // when
    const { container } = createRadio();

    // then
    const inputs = container.querySelectorAll('input[type="radio"]');

    inputs.forEach(input => {
      expect(input.checked).to.be.false;
    });
  });


  it('should render disabled', function() {

    // when
    const { container } = createRadio({
      disabled: true
    });

    // then
    const inputs = container.querySelectorAll('input[type="radio"]');

    inputs.forEach(input => {
      expect(input.disabled).to.be.true;
    });
  });


  it('should render description', function() {

    // when
    const { container } = createRadio({
      field: {
        ...defaultField,
        description: 'foo'
      }
    });

    // then
    const description = container.querySelector('.fjs-form-field-description');

    expect(description).to.exist;
    expect(description.textContent).to.equal('foo');
  });


  describe('handle change', function() {

    it('should handle change', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createRadio({
        onChange: onChangeSpy,
        value: 'camunda-platform'
      });

      // when
      const input = container.querySelectorAll('input[type="radio"]')[ 1 ];

      fireEvent.click(input);

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        path: [ 'product' ],
        value: 'camunda-cloud'
      });
    });


    it('should handle change (undefined)', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createRadio({
        onChange: onChangeSpy,
        value: 'camunda-platform'
      });

      // when
      const input = container.querySelectorAll('input[type="radio"]')[ 0 ];

      fireEvent.click(input, { target: { checked: false } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        path: [ 'product' ],
        value: undefined
      });
    });

  });



  it('#create', function() {

    // when
    const field = RadioRenderer.create();

    // then
    expect(field).to.deep.contain({
      label: 'Radio',
      type: 'radio',
      values: [
        {
          label: 'Value',
          value: 'value'
        }
      ]
    });

    expect(field.id).to.match(/radio\d+/);
    expect(field.key).to.match(/radio\d+/);
  });

});

// helpers //////////

const defaultField = {
  key: 'product',
  label: 'Product',
  type: 'radio',
  values: [
    {
      label: 'Camunda Platform',
      value: 'camunda-platform'
    },
    {
      label: 'Camunda Cloud',
      value: 'camunda-cloud'
    }
  ]
};

function createRadio(options = {}) {
  const {
    disabled,
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ],
    value
  } = options;

  return render(
    <RadioRenderer
      disabled={ disabled }
      errors={ errors }
      field={ field }
      onChange={ onChange }
      path={ path }
      value={ value } />,
    {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}