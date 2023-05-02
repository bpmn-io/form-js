import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Checklist from '../../../../../src/render/components/form-fields/Checklist';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

const spy = sinon.spy;

let container;


describe('Checklist', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createChecklist({
      value: [ 'approver' ]
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-checklist')).to.be.true;

    const inputs = container.querySelectorAll('input[type="checkbox"]');

    expect(inputs).to.have.length(3);
    expect(inputs[ 0 ].id).to.equal('fjs-form-foo-Checklist_1-0');
    expect(inputs[ 1 ].id).to.equal('fjs-form-foo-Checklist_1-1');
    expect(inputs[ 2 ].id).to.equal('fjs-form-foo-Checklist_1-2');

    expect(inputs[ 0 ].checked).to.be.true;
    expect(inputs[ 1 ].checked).to.be.false;
    expect(inputs[ 2 ].checked).to.be.false;

    const labels = container.querySelectorAll('label');

    expect(labels).to.have.length(4);
    expect(labels[ 0 ].textContent).to.equal('Email data to');
    expect(labels[ 1 ].htmlFor).to.equal('fjs-form-foo-Checklist_1-0');
    expect(labels[ 2 ].htmlFor).to.equal('fjs-form-foo-Checklist_1-1');
    expect(labels[ 3 ].htmlFor).to.equal('fjs-form-foo-Checklist_1-2');
  });


  it('should render required label', function() {

    // when
    const { container } = createChecklist({
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
    const { container } = createChecklist({
      value: [ 'dynamicValue1' ],
      field: dynamicField,
      initialData: dynamicFieldInitialData
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-checklist')).to.be.true;

    const inputs = container.querySelectorAll('input[type="checkbox"]');

    expect(inputs).to.have.length(3);
    expect(inputs[0].id).to.equal('fjs-form-foo-Checklist_1-0');
    expect(inputs[1].id).to.equal('fjs-form-foo-Checklist_1-1');
    expect(inputs[2].id).to.equal('fjs-form-foo-Checklist_1-2');

    expect(inputs[0].checked).to.be.true;
    expect(inputs[1].checked).to.be.false;
    expect(inputs[2].checked).to.be.false;

    const labels = container.querySelectorAll('label');

    expect(labels).to.have.length(4);
    expect(labels[0].textContent).to.equal('Email data to');
    expect(labels[1].htmlFor).to.equal('fjs-form-foo-Checklist_1-0');
    expect(labels[2].htmlFor).to.equal('fjs-form-foo-Checklist_1-1');
    expect(labels[3].htmlFor).to.equal('fjs-form-foo-Checklist_1-2');
  });


  it('should render default value (undefined)', function() {

    // when
    const { container } = createChecklist();

    // then
    const inputs = container.querySelectorAll('input[type="checkbox"]');

    inputs.forEach(input => {
      expect(input.checked).to.be.false;
    });
  });


  it('should render disabled', function() {

    // when
    const { container } = createChecklist({
      disabled: true
    });

    // then
    const inputs = container.querySelectorAll('input[type="checkbox"]');

    inputs.forEach(input => {
      expect(input.disabled).to.be.true;
    });
  });


  it('should render readonly', function() {

    // when
    const { container } = createChecklist({
      readonly: true
    });

    // then
    const inputs = container.querySelectorAll('input[type="checkbox"]');

    inputs.forEach(input => {
      expect(input.readOnly).to.be.true;
    });
  });


  it('should render description', function() {

    // when
    const { container } = createChecklist({
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


  describe('handle change (static)', function() {

    it('should handle change', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createChecklist({
        onChange: onChangeSpy,
        value: [ 'approver' ]
      });

      // when
      const input = container.querySelectorAll('input[type="checkbox"]')[ 1 ];

      fireEvent.click(input);

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: [ 'approver', 'manager' ]
      });
    });


    it('should handle toggle', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createChecklist({
        onChange: onChangeSpy,
        value: [ 'approver' ]
      });

      // when
      const input = container.querySelectorAll('input[type="checkbox"]')[ 0 ];

      fireEvent.click(input, { target: { checked: false } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: []
      });
    });

  });


  describe('handle change (dynamic)', function() {

    it('should handle change', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createChecklist({
        onChange: onChangeSpy,
        value: [ 'dynamicValue1' ],
        field: dynamicField,
        initialData: dynamicFieldInitialData
      });

      // when
      const input = container.querySelectorAll('input[type="checkbox"]')[1];

      fireEvent.click(input);

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: dynamicField,
        value: [ 'dynamicValue1', 'dynamicValue2' ]
      });
    });


    it('should handle toggle', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createChecklist({
        onChange: onChangeSpy,
        value: [ 'dynamicValue1' ],
        field: dynamicField,
        initialData: dynamicFieldInitialData
      });

      // when
      const input = container.querySelectorAll('input[type="checkbox"]')[0];

      fireEvent.click(input, { target: { checked: false } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: dynamicField,
        value: []
      });
    });

  });


  it('#create', function() {

    // assume
    const { config } = Checklist;
    expect(config.type).to.eql('checklist');
    expect(config.label).to.eql('Checklist');
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

      const { container } = createChecklist({
        value: [ 'approver' ]
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly', async function() {

      // given
      this.timeout(5000);

      const { container } = createChecklist({
        value: [ 'approver' ],
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(5000);

      const { container } = createChecklist({
        value: [ 'approver' ],
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const defaultField = {
  id: 'Checklist_1',
  key: 'mailto',
  label: 'Email data to',
  type: 'checklist',
  description: 'checklist',
  values: [
    {
      label: 'Approver',
      value: 'approver'
    },
    {
      label: 'Manager',
      value: 'manager'
    },
    {
      label: 'Regional Manager',
      value: 'regional-manager'
    }
  ]
};

const dynamicField = {
  id: 'Checklist_1',
  key: 'mailto',
  label: 'Email data to',
  type: 'checklist',
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
    },
    {
      label: 'Dynamic Value 3',
      value: 'dynamicValue3'
    }
  ]
};

function createChecklist(options = {}) {
  const {
    disabled,
    readonly,
    errors,
    field = defaultField,
    onChange,
    value
  } = options;

  return render(WithFormContext(
    <Checklist
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