import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Textfield from '../../../../../src/render/components/form-fields/Textfield';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

const spy = sinon.spy;

let container;


describe('Textfield', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createTextfield({
      value: 'John Doe Company'
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-textfield')).to.be.true;

    const input = container.querySelector('input[type="text"]');

    expect(input).to.exist;
    expect(input.value).to.equal('John Doe Company');
    expect(input.id).to.equal('fjs-form-foo-Textfield_1');

    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Creditor');
    expect(label.htmlFor).to.equal('fjs-form-foo-Textfield_1');
  });


  it('should render required label', function() {

    // when
    const { container } = createTextfield({
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


  it('should render adorners', function() {

    // when
    const { container } = createTextfield({
      field: {
        ...defaultField,
        appearance: {
          prefixAdorner: 'prefix',
          suffixAdorner: 'suffix'
        }
      },
      value: 123
    });

    // then
    const adorners = container.querySelectorAll('.fjs-input-adornment');

    expect(adorners.length).to.equal(2);
    expect(adorners[0].innerText).to.equal('prefix');
    expect(adorners[1].innerText).to.equal('suffix');
  });


  it('should render default value (\'\')', function() {

    // when
    const { container } = createTextfield();

    // then
    const input = container.querySelector('input[type="text"]');

    expect(input).to.exist;
    expect(input.value).to.equal('');
  });


  it('should render default value on value removed', function() {

    // given
    const props = {
      disabled: false,
      errors: [],
      field: defaultField,
      onChange: () => {}
    };

    createTextfield({
      ...props,
      value: 'foo'
    });

    const input = container.querySelector('input[type="text"]');

    // when
    fireEvent.change(input, { target: { value: null } });

    // then
    expect(input).to.exist;
    expect(input.value).to.equal('');
  });


  it('should render disabled', function() {

    // when
    const { container } = createTextfield({
      disabled: true
    });

    // then
    const input = container.querySelector('input[type="text"]');

    expect(input).to.exist;
    expect(input.disabled).to.be.true;
  });


  it('should render readonly', function() {

    // when
    const { container } = createTextfield({
      readonly: true
    });

    // then
    const input = container.querySelector('input[type="text"]');

    expect(input).to.exist;
    expect(input.readOnly).to.be.true;
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


  describe('change handling', function() {

    it('should change text', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createTextfield({
        onChange: onChangeSpy,
        value: 'John Doe Company'
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: 'Jane Doe Company' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: 'Jane Doe Company'
      });
    });


    it('should clear', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createTextfield({
        onChange: onChangeSpy,
        value: 'John Doe Company'
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: '' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: ''
      });
    });

  });

  describe('#sanitizeValue', function() {

    it('should convert boolean', function() {

      // given
      const { config } = Textfield;

      // when
      const sanitizedValue = config.sanitizeValue({ value: true });

      // then
      expect(sanitizedValue).to.equal('true');

    });


    it('should convert number', function() {

      // given
      const { config } = Textfield;

      // when
      const sanitizedValue = config.sanitizeValue({ value: 123 });

      // then
      expect(sanitizedValue).to.equal('123');

    });


    it('should sanitize object', function() {

      // given
      const { config } = Textfield;

      // when
      const sanitizedValue = config.sanitizeValue({ value: { foo: 'bar' } });

      // then
      expect(sanitizedValue).to.equal('');

    });


    it('should sanitize array', function() {

      // given
      const { config } = Textfield;

      // when
      const sanitizedValue = config.sanitizeValue({ value: [ 'foo', 'bar' ] });

      // then
      expect(sanitizedValue).to.equal('');

    });


    it('should sanitize newlines', function() {

      // given
      const { config } = Textfield;

      // when
      const sanitizedValue = config.sanitizeValue({ value: 'foo\nbar' });

      // then
      expect(sanitizedValue).to.equal('foo bar');

    });


    it('should sanitize tabs', function() {

      // given
      const { config } = Textfield;

      // when
      const sanitizedValue = config.sanitizeValue({ value: 'foo\tbar' });

      // then
      expect(sanitizedValue).to.equal('foo bar');

    });


    it('should sanitize carriage returns', function() {

      // given
      const { config } = Textfield;

      // when
      const sanitizedValue = config.sanitizeValue({ value: 'foo\rbar' });

      // then
      expect(sanitizedValue).to.equal('foo bar');

    });


    it('should sanitize combination of newlines, tabs and carriage returns', function() {

      // given
      const { config } = Textfield;

      // when
      const sanitizedValue = config.sanitizeValue({ value: 'foo\n\t\rbar' });

      // then
      expect(sanitizedValue).to.equal('foo   bar');

    });

  });


  it('#create', function() {

    // assume
    const { config } = Textfield;
    expect(config.type).to.eql('textfield');
    expect(config.label).to.eql('Text field');
    expect(config.group).to.eql('basic-input');
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

      const { container } = createTextfield({
        value: 'John Doe Company'
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly', async function() {

      // given
      this.timeout(5000);

      const { container } = createTextfield({
        value: 'John Doe Company',
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(5000);

      const { container } = createTextfield({
        value: 'John Doe Company',
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - appearance', async function() {

      // given
      this.timeout(5000);

      const { container } = createTextfield({
        value: 'John Doe Company',
        field: {
          ...defaultField,
          appearance: {
            prefixAdorner: 'foo',
            suffixAdorner: 'bar'
          }
        }
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const defaultField = {
  id: 'Textfield_1',
  key: 'creditor',
  label: 'Creditor',
  description: 'textfield',
  type: 'textfield'
};

function createTextfield(options = {}) {
  const {
    appearance = {},
    disabled,
    readonly,
    errors,
    field = defaultField,
    onChange,
    value
  } = options;

  return render(WithFormContext(
    <Textfield
      appearance={ appearance }
      disabled={ disabled }
      readonly={ readonly }
      errors={ errors }
      field={ field }
      onChange={ onChange }
      value={ value } />
  ), {
    container: options.container || container.querySelector('.fjs-form')
  });
}