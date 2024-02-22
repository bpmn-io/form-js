import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { Checklist } from '../../../../../src/render/components/form-fields/Checklist';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

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
    expect(inputs[ 0 ].id).to.equal('test-checklist-0');
    expect(inputs[ 1 ].id).to.equal('test-checklist-1');
    expect(inputs[ 2 ].id).to.equal('test-checklist-2');

    expect(inputs[ 0 ].checked).to.be.true;
    expect(inputs[ 1 ].checked).to.be.false;
    expect(inputs[ 2 ].checked).to.be.false;

    const labels = container.querySelectorAll('label');

    expect(labels).to.have.length(4);
    expect(labels[ 0 ].textContent).to.equal('Email data to');
    expect(labels[ 1 ].htmlFor).to.equal('test-checklist-0');
    expect(labels[ 2 ].htmlFor).to.equal('test-checklist-1');
    expect(labels[ 3 ].htmlFor).to.equal('test-checklist-2');
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
    expect(inputs[0].id).to.equal('test-checklist-0');
    expect(inputs[1].id).to.equal('test-checklist-1');
    expect(inputs[2].id).to.equal('test-checklist-2');

    expect(inputs[0].checked).to.be.true;
    expect(inputs[1].checked).to.be.false;
    expect(inputs[2].checked).to.be.false;

    const labels = container.querySelectorAll('label');

    expect(labels).to.have.length(4);
    expect(labels[0].textContent).to.equal('Email data to');
    expect(labels[1].htmlFor).to.equal('test-checklist-0');
    expect(labels[2].htmlFor).to.equal('test-checklist-1');
    expect(labels[3].htmlFor).to.equal('test-checklist-2');
  });


  it('should render dynamically with simplified values', function() {

    // when
    const { container } = createChecklist({
      value: [ 'dynamicValue1' ],
      field: dynamicField,
      initialData: dynamicFieldInitialDataSimplified
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-checklist')).to.be.true;

    const inputs = container.querySelectorAll('input[type="checkbox"]');
    expect(inputs).to.have.length(3);
    expect(inputs[0].id).to.equal('test-checklist-0');
    expect(inputs[1].id).to.equal('test-checklist-1');
    expect(inputs[2].id).to.equal('test-checklist-2');

    expect(inputs[0].checked).to.be.true;
    expect(inputs[1].checked).to.be.false;
    expect(inputs[2].checked).to.be.false;

    const labels = container.querySelectorAll('label');

    expect(labels).to.have.length(4);
    expect(labels[0].textContent).to.equal('Email data to');
    expect(labels[1].htmlFor).to.equal('test-checklist-0');
    expect(labels[2].htmlFor).to.equal('test-checklist-1');
    expect(labels[3].htmlFor).to.equal('test-checklist-2');
  });


  it('should render dynamically with object values', function() {

    // when
    const { container } = createChecklist({
      value: [ {
        id: 'user3',
        name: 'User 3',
        email: 'user3@email.com'
      } ],
      field: dynamicField,
      initialData: dynamicFieldInitialDataObjectValues
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-checklist')).to.be.true;

    const inputs = container.querySelectorAll('input[type="checkbox"]');
    expect(inputs).to.have.length(3);
    expect(inputs[0].id).to.equal('test-checklist-0');
    expect(inputs[1].id).to.equal('test-checklist-1');
    expect(inputs[2].id).to.equal('test-checklist-2');

    expect(inputs[0].checked).to.be.false;
    expect(inputs[1].checked).to.be.false;
    expect(inputs[2].checked).to.be.true;

    const labels = container.querySelectorAll('label');

    expect(labels).to.have.length(4);
    expect(labels[0].textContent).to.equal('Email data to');
    expect(labels[1].htmlFor).to.equal('test-checklist-0');
    expect(labels[2].htmlFor).to.equal('test-checklist-1');
    expect(labels[3].htmlFor).to.equal('test-checklist-2');
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


    it('should handle change simplified values', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createChecklist({
        onChange: onChangeSpy,
        value: [ 'dynamicValue1' ],
        field: dynamicField,
        initialData: dynamicFieldInitialDataSimplified
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


    it('should handle change object values', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createChecklist({
        onChange: onChangeSpy,
        value: [ {
          id: 'user3',
          name: 'User 3',
          email: 'user3@email.com'
        } ],
        field: dynamicField,
        initialData: dynamicFieldInitialDataObjectValues
      });

      // when
      const input = container.querySelectorAll('input[type="checkbox"]')[1];

      fireEvent.click(input);

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: dynamicField,
        value: [ {
          id: 'user3',
          name: 'User 3',
          email: 'user3@email.com'
        }, {
          id: 'user2',
          name: 'User 2',
          email: 'user2@email.com'
        } ]
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


    it('should handle toggle object values', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createChecklist({
        onChange: onChangeSpy,
        value: [ {
          id: 'user3',
          name: 'User 3',
          email: 'user3@email.com'
        } ],
        field: dynamicField,
        initialData: dynamicFieldInitialDataObjectValues
      });

      // when
      const input = container.querySelectorAll('input[type="checkbox"]')[2];

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
    expect(config.label).to.eql('Checkbox group');
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


  describe('#sanitizeValue', function() {

    it('should sanitize value if options are not contained (static)', function() {

      // given
      const { sanitizeValue } = Checklist.config;

      // when
      const sanitizedValue = sanitizeValue({ value: [ 'camunda-not-platform' ], data: {}, formField: defaultField });

      // then
      expect(sanitizedValue).to.deep.equal([]);
    });


    it('should sanitize value if options are not contained (dynamic)', function() {

      // given
      const { sanitizeValue } = Checklist.config;

      // when
      const sanitizedValue = sanitizeValue({ value: [ 'dynamicValue3', 'dynamicValue4' ], data: dynamicFieldInitialData, formField: dynamicField });

      // then
      expect(sanitizedValue).to.deep.equal([ 'dynamicValue3' ]);
    });


    it('should not try to sanitize value if options are expression evaluated', function() {

      // given
      const { sanitizeValue } = Checklist.config;

      // when
      const sanitizedValue = sanitizeValue({ value: [ 'camunda-not-platform' ], data: {}, formField: { ...defaultField, valuesExpression: '=someExpression' } });

      // then
      expect(sanitizedValue).to.deep.equal([ 'camunda-not-platform' ]);
    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createChecklist({
        value: [ 'approver' ]
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly', async function() {

      // given
      this.timeout(10000);

      const { container } = createChecklist({
        value: [ 'approver' ],
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(10000);

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

const dynamicFieldInitialDataSimplified = {
  dynamicValues: [
    'dynamicValue1',
    'dynamicValue2',
    'dynamicValue3'
  ]
};

const dynamicFieldInitialDataObjectValues = {
  dynamicValues: [
    {
      label: 'User 1',
      value: {
        id: 'user1',
        name: 'User 1',
        email: 'user1@email.com'
      }
    },
    {
      label: 'User 2',
      value: {
        id: 'user2',
        name: 'User 2',
        email: 'user2@email.com'
      }
    },
    {
      label: 'User 3',
      value: {
        id: 'user3',
        name: 'User 3',
        email: 'user3@email.com'
      }
    }
  ]
};

function createChecklist({ services, ...restOptions } = {}) {

  const options = {
    domId: 'test-checklist',
    field: defaultField,
    onChange: () => {},
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <Checklist
        disabled={ options.disabled }
        readonly={ options.readonly }
        errors={ options.errors }
        domId={ options.domId }
        field={ options.field }
        onChange={ options.onChange }
        onBlur={ options.onBlur }
        value={ options.value } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}