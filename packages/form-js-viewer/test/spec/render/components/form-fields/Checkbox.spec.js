import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Checkbox from '../../../../../src/render/components/form-fields/Checkbox';

import { createFormContainer } from '../../../../TestHelper';

const spy = sinon.spy;

let container;


describe('Checkbox', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createCheckbox({
      value: true
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-checkbox')).to.be.true;

    const input = container.querySelector('input[type="checkbox"]');

    expect(input).to.exist;
    expect(input.checked).to.be.true;

    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Approved');
  });


  it('should render default value (false)', function() {

    // when
    const { container } = createCheckbox();

    // then
    const input = container.querySelector('input[type="checkbox"]');

    expect(input).to.exist;
    expect(input.checked).to.be.false;
  });


  it('should render disabled', function() {

    // when
    const { container } = createCheckbox({
      disabled: true
    });

    // then
    const input = container.querySelector('input[type="checkbox"]');

    expect(input).to.exist;
    expect(input.disabled).to.be.true;
  });


  it('should render without label', function() {

    // when
    const { container } = createCheckbox({
      field: {
        ...defaultField,
        label: ''
      }
    });

    // then
    const label = container.querySelector('label');

    expect(label).to.exist;
  });


  it('should render description', function() {

    // when
    const { container } = createCheckbox({
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

    const { container } = createCheckbox({
      onChange: onChangeSpy,
      value: true
    });

    // when
    const input = container.querySelector('input[type="checkbox"]');

    fireEvent.change(input, { target: { checked: false } });

    // then
    expect(onChangeSpy).to.have.been.calledWith({
      field: defaultField,
      value: false
    });
  });


  it('#create', function() {

    // assume
    expect(Checkbox.type).to.eql('checkbox');
    expect(Checkbox.label).to.eql('Checkbox');
    expect(Checkbox.keyed).to.be.true;

    // when
    const field = Checkbox.create();

    // then
    expect(field).to.eql({});

    // but when
    const customField = Checkbox.create({
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
  key: 'approved',
  label: 'Approved',
  type: 'checkbox'
};

function createCheckbox(options = {}) {
  const {
    disabled,
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ],
    value
  } = options;

  return render(
    <Checkbox
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