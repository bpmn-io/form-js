import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Radio from '../../../../../src/render/components/form-fields/Radio';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

const spy = sinon.spy;

let container;


describe('Radio', function() {

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
    expect(inputs[ 0 ].id).to.equal('fjs-form-foo-Radio_1-0');
    expect(inputs[ 1 ].id).to.equal('fjs-form-foo-Radio_1-1');

    const labels = container.querySelectorAll('label');

    expect(labels).to.have.length(3);
    expect(labels[ 0 ].textContent).to.equal('Product');
    expect(labels[ 1 ].htmlFor).to.equal('fjs-form-foo-Radio_1-0');
    expect(labels[ 2 ].htmlFor).to.equal('fjs-form-foo-Radio_1-1');
  });


  it('should render required label', function() {

    // when
    const { container } = createRadio({
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


  it('should render dynamically', function() {

    // when
    const { container } = createRadio({
      value: 'dynamicValue1',
      field: dynamicField,
      initialData: dynamicFieldInitialData
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-radio')).to.be.true;

    const inputs = container.querySelectorAll('input[type="radio"]');

    expect(inputs).to.have.length(2);
    expect(inputs[0].id).to.equal('fjs-form-foo-Radio_1-0');
    expect(inputs[1].id).to.equal('fjs-form-foo-Radio_1-1');

    const labels = container.querySelectorAll('label');

    expect(labels).to.have.length(3);
    expect(labels[0].textContent).to.equal('Product');
    expect(labels[1].htmlFor).to.equal('fjs-form-foo-Radio_1-0');
    expect(labels[2].htmlFor).to.equal('fjs-form-foo-Radio_1-1');
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


  it('should render <null> value', function() {

    // when
    const { container } = createRadio({
      value: null
    });

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


  it('should render readonly', function() {

    // when
    const { container } = createRadio({
      readonly: true
    });

    // then
    const inputs = container.querySelectorAll('input[type="radio"]');

    inputs.forEach(input => {
      expect(input.readOnly).to.be.true;
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


  describe('handle change (dynamic)', function() {

    it('should handle change', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createRadio({
        onChange: onChangeSpy,
        value: 'dynamicValue1',
        field: dynamicField,
        initialData: dynamicFieldInitialData
      });

      // when
      const input = container.querySelectorAll('input[type="radio"]')[ 1 ];

      fireEvent.click(input);

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: dynamicField,
        value: 'dynamicValue2'
      });
    });


    it('should handle toggle', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createRadio({
        onChange: onChangeSpy,
        value: 'dynamicValue1',
        field: dynamicField,
        initialData: dynamicFieldInitialData
      });

      // when
      const input = container.querySelectorAll('input[type="radio"]')[ 0 ];

      fireEvent.click(input, { target: { checked: false } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: dynamicField,
        value: 'dynamicValue1'
      });
    });

  });


  describe('handle change (static)', function() {

    it('should handle change', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createRadio({
        onChange: onChangeSpy,
        value: 'camunda-platform'
      });

      // when
      const input = container.querySelectorAll('input[type="radio"]')[1];

      fireEvent.click(input);

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: 'camunda-cloud'
      });
    });


    it('should handle toggle', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createRadio({
        onChange: onChangeSpy,
        value: 'camunda-platform'
      });

      // when
      const input = container.querySelectorAll('input[type="radio"]')[0];

      fireEvent.click(input, { target: { checked: false } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: 'camunda-platform'
      });
    });

  });


  it('#create', function() {

    // assume
    const { config } = Radio;
    expect(config.type).to.eql('radio');
    expect(config.label).to.eql('Radio');
    expect(config.group).to.eql('selection');
    expect(config.keyed).to.be.true;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({
      values: [
        {
          label: 'Value',
          value: 'value'
        }
      ]
    });

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

      const { container } = createRadio({
        value: 'camunda-platform'
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly', async function() {

      // given
      this.timeout(5000);

      const { container } = createRadio({
        value: 'camunda-platform',
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(5000);

      const { container } = createRadio({
        value: 'camunda-platform',
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const defaultField = {
  id: 'Radio_1',
  key: 'product',
  label: 'Product',
  type: 'radio',
  description: 'radio',
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

const dynamicField = {
  id: 'Radio_1',
  key: 'product',
  label: 'Product',
  type: 'radio',
  valuesKey: 'dynamicValues'
};

const dynamicFieldInitialData = {
  dynamicValues: [
    {
      label: 'Dynamic Value 1',
      value: 'dynamicValue1'
    },
    {
      label: 'Dynamic Value 2',
      value: 'dynamicValue2'
    }
  ]
};

function createRadio(options = {}) {
  const {
    disabled,
    readonly,
    errors,
    field = defaultField,
    onChange,
    value
  } = options;

  return render(WithFormContext(
    <Radio
      disabled={ disabled }
      readonly={ readonly }
      errors={ errors }
      field={ field }
      onChange={ onChange }
      value={ value } />,
    options
  ), {
    container: options.container || container.querySelector('.fjs-form')
  });
}