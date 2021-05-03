import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import CheckboxRenderer from '../../../../src/rendering/fields/CheckboxRenderer';

import { createFormContainer } from '../../../TestHelper';

const spy = sinon.spy;

let container;


describe('CheckboxRenderer', function() {

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
      path: [ 'approved' ],
      value: false
    });
  });


  it('#create', function() {

    // when
    const field = CheckboxRenderer.create();

    // then
    expect(field).to.contain({
      label: 'Checkbox',
      type: 'checkbox'
    });

    expect(field.id).to.match(/checkbox\d+/);
    expect(field.key).to.match(/checkbox\d+/);
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
    <CheckboxRenderer
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