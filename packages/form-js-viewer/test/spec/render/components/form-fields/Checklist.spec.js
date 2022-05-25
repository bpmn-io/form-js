import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Checklist from '../../../../../src/render/components/form-fields/Checklist';

import { createFormContainer } from '../../../../TestHelper';

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
      value: ['approver']
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


  describe('handle change', function() {

    it('should handle change', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createChecklist({
        onChange: onChangeSpy,
        value: ['approver']
      });

      // when
      const input = container.querySelectorAll('input[type="checkbox"]')[ 1 ];

      fireEvent.click(input);

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: ['approver', 'manager']
      });
    });


    it('should handle toggle', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createChecklist({
        onChange: onChangeSpy,
        value: ['approver']
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


  it('#create', function() {

    // assume
    expect(Checklist.type).to.eql('checklist');
    expect(Checklist.label).to.eql('Checklist');
    expect(Checklist.keyed).to.be.true;

    // when
    const field = Checklist.create();

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
    const customField = Checklist.create({
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
  'id': 'Checklist_1',
  'key': 'mailto',
  'label': 'Email data to',
  'type': 'checklist',
  'values': [
    {
      'label': 'Approver',
      'value': 'approver'
    },
    {
      'label': 'Manager',
      'value': 'manager'
    },
    {
      'label': 'Regional Manager',
      'value': 'regional-manager'
    }
  ]
};

function createChecklist(options = {}) {
  const {
    disabled,
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ],
    value
  } = options;

  return render(WithFormContext(
    <Checklist
      disabled={ disabled }
      errors={ errors }
      field={ field }
      onChange={ onChange }
      path={ path }
      value={ value } />
  ), {
    container: options.container || container.querySelector('.fjs-form')
  });
}