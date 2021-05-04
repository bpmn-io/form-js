import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import NumberRenderer from '../../../../src/rendering/fields/NumberRenderer';

import { createFormContainer } from '../../../TestHelper';

const spy = sinon.spy;

let container;


describe('NumberRenderer', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createTextfield({
      value: 123
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-number')).to.be.true;

    const input = container.querySelector('input[type="number"]');

    expect(input).to.exist;
    expect(input.value).to.equal('123');

    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Amount');
  });


  it('should render default value (\'\')', function() {

    // when
    const { container } = createTextfield();

    // then
    const input = container.querySelector('input[type="number"]');

    expect(input).to.exist;
    expect(input.value).to.equal('');
  });


  it('should render disabled', function() {

    // when
    const { container } = createTextfield({
      disabled: true
    });

    // then
    const input = container.querySelector('input[type="number"]');

    expect(input).to.exist;
    expect(input.disabled).to.be.true;
  });


  it('should render description', function() {

    // when
    const { container } = createTextfield({
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


  it('should handle change', function() {

    // given
    const onChangeSpy = spy();

    const { container } = createTextfield({
      onChange: onChangeSpy,
      value: 123
    });

    // when
    const input = container.querySelector('input[type="number"]');

    fireEvent.input(input, { target: { value: '124' } });

    // then
    expect(onChangeSpy).to.have.been.calledWith({
      path: [ 'amount' ],
      value: 124
    });
  });


  it('#create', function() {

    // when
    const field = NumberRenderer.create();

    // then
    expect(field).to.contain({
      label: 'Number',
      type: 'number'
    });

    expect(field.id).to.match(/number\d+/);
    expect(field.key).to.match(/number\d+/);
  });

});

// helpers //////////

const defaultField = {
  key: 'amount',
  label: 'Amount',
  type: 'number'
};

function createTextfield(options = {}) {
  const {
    disabled,
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ],
    value
  } = options;

  return render(
    <NumberRenderer
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