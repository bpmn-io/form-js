import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Number from '../../../../../src/render/components/form-fields/Number';

import { createFormContainer } from '../../../../TestHelper';

const spy = sinon.spy;

let container;


describe('Number', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createNumberField({
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
    const { container } = createNumberField();

    // then
    const input = container.querySelector('input[type="number"]');

    expect(input).to.exist;
    expect(input.value).to.equal('');
  });


  it('should render <null> value', function() {

    // when
    const { container } = createNumberField({
      value: null
    });

    // then
    const input = container.querySelector('input[type="number"]');

    expect(input).to.exist;
    expect(input.value).to.equal('');
  });


  it('should render default value on value removed', function() {

    // given
    const props = {
      disabled: false,
      errors: [],
      field: defaultField,
      onChange: () => {},
      path: [ defaultField.key ]
    };

    const options = { container: container.querySelector('.fjs-form') };

    const { rerender } = render(<Number { ...props } value={ 123 } />, options);

    // when
    rerender(<Number { ...props } value={ null } />, options);

    // then
    const input = container.querySelector('input[type="number"]');

    expect(input).to.exist;
    expect(input.value).to.equal('');
  });


  it('should render disabled', function() {

    // when
    const { container } = createNumberField({
      disabled: true
    });

    // then
    const input = container.querySelector('input[type="number"]');

    expect(input).to.exist;
    expect(input.disabled).to.be.true;
  });


  it('should render description', function() {

    // when
    const { container } = createNumberField({
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


  describe('change handling', function() {

    it('should change number', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 123
      });

      // when
      const input = container.querySelector('input[type="number"]');

      fireEvent.input(input, { target: { value: '124' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: 124
      });
    });


    it('should clear', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 123
      });

      // when
      const input = container.querySelector('input[type="number"]');

      fireEvent.input(input, { target: { value: '' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: null
      });
    });

  });


  it('#create', function() {

    // assume
    expect(Number.type).to.eql('number');
    expect(Number.label).to.eql('Number');
    expect(Number.keyed).to.be.true;

    // when
    const field = Number.create();

    // then
    expect(field).to.eql({});

    // but when
    const customField = Number.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });

});

// helpers //////////

const defaultField = {
  key: 'amount',
  label: 'Amount',
  type: 'number'
};

function createNumberField(options = {}) {
  const {
    disabled,
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ],
    value
  } = options;

  return render(
    <Number
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