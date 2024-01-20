import {
  fireEvent,
  createEvent,
  render
} from '@testing-library/preact/pure';

import { Numberfield } from '../../../../../src/render/components/form-fields/Number';

import { MockFormContext } from '../helper';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

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

    const input = container.querySelector('input[type="text"]');

    expect(input).to.exist;
    expect(input.value).to.equal('123');

    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Amount');
  });


  it('should render required label', function() {

    // when
    const { container } = createNumberField({
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
    const { container } = createNumberField({
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


  it('should not render empty adorners', function() {

    // when
    const { container } = createNumberField({
      field: {
        ...defaultField,
        appearance: {
          prefixAdorner: '',
          suffixAdorner: ''
        }
      },
      value: 123
    });

    // then
    const adorners = container.querySelectorAll('.fjs-input-adornment');

    expect(adorners.length).to.equal(0);

  });


  it('should render 0 strings', function() {

    // when
    const { container } = createNumberField({
      field: {
        ...defaultField,
        appearance: {
          prefixAdorner: '0',
          suffixAdorner: '0'
        }
      },
      value: 123
    });

    // then
    const adorners = container.querySelectorAll('.fjs-input-adornment');

    expect(adorners.length).to.equal(2);
    expect(adorners[0].innerText).to.equal('0');
    expect(adorners[1].innerText).to.equal('0');
  });


  it('should render default value (\'\')', function() {

    // when
    const { container } = createNumberField();

    // then
    const input = container.querySelector('input[type="text"]');

    expect(input).to.exist;
    expect(input.value).to.equal('');
  });


  it('should render <null> value', function() {

    // when
    const { container } = createNumberField({
      value: null
    });

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

    createNumberField({
      ...props,
      value: '2'
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
    const { container } = createNumberField({
      disabled: true
    });

    // then
    const input = container.querySelector('input[type="text"]');

    expect(input).to.exist;
    expect(input.disabled).to.be.true;
  });


  it('should render readonly', function() {

    // when
    const { container } = createNumberField({
      readonly: true
    });

    // then
    const input = container.querySelector('input[type="text"]');

    expect(input).to.exist;
    expect(input.readOnly).to.be.true;
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
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: '124' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: 124
      });
    });


    it('should not serialize standalone minus', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: null
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: '-' } });

      // then
      expect(onChangeSpy).to.not.have.been.called;
    });


    it('should clear', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 123
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: '' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: null
      });
    });


  });


  describe('interaction', function() {

    describe('increment button', function() {

      it('should increment', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          onChange: onChangeSpy,
          value: 123
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-up');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: defaultField,
          value: 124
        });
      });


      it('should increment according to `decimalDigits`', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          field: decimalField,
          onChange: onChangeSpy,
          value: 123
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-up');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: decimalField,
          value: 123.001
        });
      });


      it('should increment according to `step`', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          field: stepField,
          onChange: onChangeSpy,
          value: 123
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-up');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: stepField,
          value: 123.25
        });
      });


      it('should increment to exact step when not aligned', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          field: stepField,
          onChange: onChangeSpy,
          value: 122.99
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-up');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: stepField,
          value: 123
        });
      });


      it('should increment properly when negative', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          field: stepField,
          onChange: onChangeSpy,
          value: -1
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-up');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: stepField,
          value: -0.75
        });
      });
    });


    describe('decrement button', function() {

      it('should decrement', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          onChange: onChangeSpy,
          value: 123
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-down');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: defaultField,
          value: 122
        });
      });


      it('should decrement according to `decimalDigits`', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          field: decimalField,
          onChange: onChangeSpy,
          value: 123
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-down');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: decimalField,
          value: 122.999
        });
      });


      it('should decrement according to `step`', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          field: stepField,
          onChange: onChangeSpy,
          value: 123
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-down');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: stepField,
          value: 122.75
        });
      });


      it('should decrement to exact step when not aligned', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          field: stepField,
          onChange: onChangeSpy,
          value: 122.76
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-down');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: stepField,
          value: 122.75
        });
      });


      it('should decrement properly when negative', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createNumberField({
          field: stepField,
          onChange: onChangeSpy,
          value: -1
        });

        // when
        const incrementButton = container.querySelector('.fjs-number-arrow-down');
        fireEvent.click(incrementButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: stepField,
          value: -1.25
        });
      });
    });

  });


  describe('formatting', function() {

    it('should handle string inputs as numbers by default', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 123,
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: '124' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: 124
      });

    });


    it('should handle number inputs as strings if configured', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 123,
        field: stringField
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: 124 } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: stringField,
        value: '124'
      });

    });


    it('should handle string inputs as strings if configured', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 123,
        field: stringField
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: '125' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: stringField,
        value: '125'
      });

    });


    it('should handle high precision string numbers without trimming', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 123,
        field: stringField
      });

      const highPrecisionStringNumber = '125.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001';

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: highPrecisionStringNumber } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: stringField,
        value: highPrecisionStringNumber
      });

    });


    it('should treat invalid string numbers as "NaN"', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 123,
        field: stringField
      });


      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: '12.25a' } });

      // then
      expect(input.value).to.equal('NaN');
      expect(onChangeSpy).to.have.been.calledWith({
        field: stringField,
        value: null
      });

    });

  });


  describe('user input', function() {

    it('should prevent key presses generating non-number characters', function() {

      // given
      const { container } = createNumberField({
        value: 123
      });

      const input = container.querySelector('input[type="text"]');

      expect(input).to.exist;
      expect(input.value).to.equal('123');

      const periodKeyPress = createEvent.keyPress(input, { key: '.', code: 'Period' });
      const commaKeyPress = createEvent.keyPress(input, { key: '.', code: 'Comma' });
      const letterKeyPress = createEvent.keyPress(input, { key: 'a', code: 'KeyA' });
      const digitKeyPress = createEvent.keyPress(input, { key: '2', code: 'Digit2' });
      const minusKeyPress = createEvent.keyPress(input, { key: 'a', code: 'KeyA' });

      // when
      fireEvent.focus(input);
      fireEvent(input, periodKeyPress);
      fireEvent(input, commaKeyPress);
      fireEvent(input, letterKeyPress);
      fireEvent(input, digitKeyPress);
      fireEvent(input, minusKeyPress);

      // then
      expect(periodKeyPress.defaultPrevented).to.be.false;
      expect(commaKeyPress.defaultPrevented).to.be.false;
      expect(letterKeyPress.defaultPrevented).to.be.true;
      expect(digitKeyPress.defaultPrevented).to.be.false;
      expect(minusKeyPress.defaultPrevented).to.be.true;

    });


    it('should prevent second comma or period', function() {

      // given
      const { container } = createNumberField({
        value: 123.5
      });

      const input = container.querySelector('input[type="text"]');

      expect(input).to.exist;
      expect(input.value).to.equal('123.5');

      const periodKeyPress = createEvent.keyPress(input, { key: '.', code: 'Period' });
      const commaKeyPress = createEvent.keyPress(input, { key: '.', code: 'Comma' });

      // when
      fireEvent.focus(input);
      fireEvent(input, periodKeyPress);
      fireEvent(input, commaKeyPress);

      // then
      expect(periodKeyPress.defaultPrevented).to.be.true;
      expect(commaKeyPress.defaultPrevented).to.be.true;

    });


    it('should allow a minus at the start', function() {

      // given
      const { container } = createNumberField({
        value: null
      });

      const input = container.querySelector('input[type="text"]');

      expect(input).to.exist;
      expect(input.value).to.equal('');

      const minusKeyPress = createEvent.keyPress(input, { key: '-', code: 'Minus' });

      // when
      fireEvent.focus(input);
      fireEvent(input, minusKeyPress);

      // then
      expect(minusKeyPress.defaultPrevented).to.be.false;

    });


    it('should clear NaN state on backspace', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 'NaN'
      });

      // when
      const input = container.querySelector('input[type="text"]');

      expect(input).to.exist;
      expect(input.value).to.equal('NaN');

      fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: null
      });
    });


    it('should clear NaN state on delete', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 'NaN'
      });

      // when
      const input = container.querySelector('input[type="text"]');

      expect(input).to.exist;
      expect(input.value).to.equal('NaN');

      fireEvent.keyDown(input, { key: 'Delete', code: 'Delete' });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: null
      });
    });


    it('should increment on arrow up', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 0
      });

      // when
      const input = container.querySelector('input[type="text"]');

      expect(input).to.exist;
      expect(input.value).to.equal('0');

      fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: 1
      });
    });


    it('should decrement on arrow down', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createNumberField({
        onChange: onChangeSpy,
        value: 0
      });

      // when
      const input = container.querySelector('input[type="text"]');

      expect(input).to.exist;
      expect(input.value).to.equal('0');

      fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: -1
      });
    });

  });


  it('#create', function() {

    // assume
    const { config } = Numberfield;
    expect(config.type).to.eql('number');
    expect(config.label).to.eql('Number');
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


  describe('#sanitizeValue', function() {

    it('should sanitize valid number strings to numbers', function() {

      // given
      const { sanitizeValue } = Numberfield.config;

      // when
      const sanitizedValue1 = sanitizeValue({ value: '123', formField: { serializeToString: false } });
      const sanitizedValue2 = sanitizeValue({ value: '123.23', formField: { serializeToString: false } });
      const sanitizedValue3 = sanitizeValue({ value: '0', formField: { serializeToString: false } });
      const sanitizedValue4 = sanitizeValue({ value: '-1.1', formField: { serializeToString: false } });

      // then
      expect(sanitizedValue1).to.equal(123);
      expect(sanitizedValue2).to.equal(123.23);
      expect(sanitizedValue3).to.equal(0);
      expect(sanitizedValue4).to.equal(-1.1);

    });


    it('should sanitize arrays and objects to null', function() {

      // given
      const { sanitizeValue } = Numberfield.config;

      // when
      const sanitizedValue1 = sanitizeValue({ value: [], formField: { serializeToString: false } });
      const sanitizedValue2 = sanitizeValue({ value: {}, formField: { serializeToString: false } });

      // then
      expect(sanitizedValue1).to.equal(null);
      expect(sanitizedValue2).to.equal(null);

    });


    it('should sanitize invalid number strings to null', function() {

      // given
      const { sanitizeValue } = Numberfield.config;

      // when
      const sanitizedValue1 = sanitizeValue({ value: 'abc', formField: { serializeToString: false } });
      const sanitizedValue2 = sanitizeValue({ value: '123abc', formField: { serializeToString: false } });
      const sanitizedValue3 = sanitizeValue({ value: 'abc123', formField: { serializeToString: false } });
      const sanitizedValue4 = sanitizeValue({ value: '123.23abc', formField: { serializeToString: false } });
      const sanitizedValue5 = sanitizeValue({ value: 'abc123.23', formField: { serializeToString: false } });

      // then
      expect(sanitizedValue1).to.equal(null);
      expect(sanitizedValue2).to.equal(null);
      expect(sanitizedValue3).to.equal(null);
      expect(sanitizedValue4).to.equal(null);
      expect(sanitizedValue5).to.equal(null);

    });


    it('should sanitize booleans to null', function() {

      // given
      const { sanitizeValue } = Numberfield.config;

      // when
      const sanitizedValue1 = sanitizeValue({ value: true, formField: { serializeToString: false } });
      const sanitizedValue2 = sanitizeValue({ value: false, formField: { serializeToString: false } });

      // then
      expect(sanitizedValue1).to.equal(null);
      expect(sanitizedValue2).to.equal(null);

    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createNumberField({
        value: 123
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly', async function() {

      // given
      this.timeout(10000);

      const { container } = createNumberField({
        value: 123,
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(10000);

      const { container } = createNumberField({
        value: 123,
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations (decimal field)', async function() {

      // given
      this.timeout(10000);

      const { container } = createNumberField({
        field: decimalField,
        value: 123.23
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations (string parsed field)', async function() {

      // given
      this.timeout(10000);

      const { container } = createNumberField({
        field: stringField,
        value: '123.233333333333333333333'
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations (step field)', async function() {

      // given
      this.timeout(10000);

      const { container } = createNumberField({
        field: stringField,
        value: 123.25
      });

      // then
      await expectNoViolations(container);
    });


  });

});

// helpers //////////

const defaultField = {
  key: 'amount',
  label: 'Amount',
  type: 'number',
  description: 'number'
};

const stringField = {
  ...defaultField,
  serializeToString: true
};

const decimalField = {
  ...defaultField,
  decimalDigits: 3
};

const stepField = {
  ...defaultField,
  decimalDigits: 3,
  increment: 0.25
};

function createNumberField({ services, ...restOptions } = {}) {

  const options = {
    domId: 'test-number',
    field: defaultField,
    onChange: () => {},
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <Numberfield
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
