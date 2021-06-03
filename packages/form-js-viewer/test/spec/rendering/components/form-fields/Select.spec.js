import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Select from '../../../../../src/render/components/form-fields/Select';

import { createFormContainer } from '../../../../TestHelper';

const spy = sinon.spy;

let container;


describe('Select', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createSelect({
      value: 'german'
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-select')).to.be.true;

    const select = container.querySelector('select');

    expect(select).to.exist;

    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Language');
  });


  it('should render default value (undefined)', function() {

    // when
    const { container } = createSelect();

    // then
    const select = container.querySelector('select');

    expect(select.value).to.equal('');
  });


  it('should render disabled', function() {

    // when
    const { container } = createSelect({
      disabled: true
    });

    // then
    const select = container.querySelector('select');

    expect(select.disabled).to.be.true;
  });


  it('should render description', function() {

    // when
    const { container } = createSelect({
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

      const { container } = createSelect({
        onChange: onChangeSpy,
        value: 'german'
      });

      // when
      const select = container.querySelector('select');

      fireEvent.change(select, { target: { value: 'english' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        path: [ 'language' ],
        value: 'english'
      });
    });


    it('should handle change (undefined)', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createSelect({
        onChange: onChangeSpy,
        value: 'german'
      });

      // when
      const select = container.querySelector('select');

      fireEvent.change(select, { target: { value: '' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        path: [ 'language' ],
        value: undefined
      });
    });

  });



  it('#create', function() {

    // when
    const field = Select.create();

    // then
    expect(field).to.deep.contain({
      label: 'Select',
      type: 'select',
      values: [
        {
          label: 'Value',
          value: 'value'
        }
      ]
    });

    expect(field.id).to.match(/select\d+/);
    expect(field.key).to.match(/select\d+/);
  });

});

// helpers //////////

const defaultField = {
  key: 'language',
  label: 'Language',
  type: 'select',
  values: [
    {
      label: 'German',
      value: 'german'
    },
    {
      label: 'English',
      value: 'english'
    }
  ]
};

function createSelect(options = {}) {
  const {
    disabled,
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ],
    value
  } = options;

  return render(
    <Select
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