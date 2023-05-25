import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Checkbox from '../../../../../src/render/components/form-fields/Checkbox';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

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


  it('should render required label', function() {

    // when
    const { container } = createCheckbox({
      field: {
        ...defaultField,
        label: 'Required',
        validate: {
          required: true
        }
      }
    });

    // then
    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Required*');
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


  it('should render readonly', function() {

    // when
    const { container } = createCheckbox({
      readonly: true
    });

    // then
    const input = container.querySelector('input[type="checkbox"]');

    expect(input).to.exist;
    expect(input.readOnly).to.be.true;
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
    const { config } = Checkbox;
    expect(config.type).to.eql('checkbox');
    expect(config.label).to.eql('Checkbox');
    expect(config.group).to.eql('selection');
    expect(config.keyed).to.be.true;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({});

    // but when
    const customField = config.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const { container } = createCheckbox({
        value: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly', async function() {

      // given
      this.timeout(5000);

      const { container } = createCheckbox({
        value: true,
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(5000);

      const { container } = createCheckbox({
        value: true,
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const defaultField = {
  key: 'approved',
  label: 'Approved',
  type: 'checkbox',
  description: 'checkbox'
};

function createCheckbox(options = {}) {
  const {
    disabled,
    readonly,
    errors,
    field = defaultField,
    onChange,
    value
  } = options;

  return render(WithFormContext(
    <Checkbox
      disabled={ disabled }
      readonly={ readonly }
      errors={ errors }
      field={ field }
      onChange={ onChange }
      value={ value } />,
  ), {
    container: options.container || container.querySelector('.fjs-form')
  });
}