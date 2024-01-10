import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { Textarea } from '../../../../../src/render/components/form-fields/Textarea';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

const spy = sinon.spy;

let container;


describe('Textarea', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createTextarea({
      value: 'This is a sample comment in a text area /nIt includes a line break'
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-textarea')).to.be.true;

    const textarea = container.querySelector('textarea');

    expect(textarea).to.exist;
    expect(textarea.value).to.equal('This is a sample comment in a text area /nIt includes a line break');
    expect(textarea.id).to.equal('test-textarea');

    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Approver Comments');
    expect(label.htmlFor).to.equal('test-textarea');
  });


  it('should render required label', function() {

    // when
    const { container } = createTextarea({
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


  it('should render default value (\'\')', function() {

    // when
    const { container } = createTextarea();

    // then
    const input = container.querySelector('textarea');

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

    createTextarea({
      ...props,
      value: 'foo'
    });

    const textarea = container.querySelector('textarea');

    fireEvent.change(textarea, { target: { value: null } });

    // then
    expect(textarea).to.exist;
    expect(textarea.value).to.equal('');
  });


  it('should render disabled', function() {

    // when
    const { container } = createTextarea({
      disabled: true
    });

    // then
    const textarea = container.querySelector('textarea');

    expect(textarea).to.exist;
    expect(textarea.disabled).to.be.true;
  });


  it('should render readonly', function() {

    // when
    const { container } = createTextarea({
      readonly: true
    });

    // then
    const textarea = container.querySelector('textarea');

    expect(textarea).to.exist;
    expect(textarea.readOnly).to.be.true;
  });


  it('should render description', function() {

    // when
    const { container } = createTextarea({
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

      const { container } = createTextarea({
        onChange: onChangeSpy,
        value: 'A text area value'
      });

      // when
      const textarea = container.querySelector('textarea');

      fireEvent.input(textarea, { target: { value: 'A different text area value' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: 'A different text area value'
      });
    });


    it('should autosize', function() {

      // given
      const { container } = createTextarea({
        value: '',
        onChange: () => { }
      });

      // when
      const textarea = container.querySelector('textarea');

      // then
      expect(textarea.style.height === '75px');

      fireEvent.input(textarea, { target: { value: '\n'.repeat(5) } });
      expect(textarea.style.height === '142px');

      fireEvent.input(textarea, { target: { value: '\n'.repeat(20) } });
      expect(textarea.style.height === '350px');

      fireEvent.input(textarea, { target: { value: '\n'.repeat(200) } });
      expect(textarea.style.height === '350px');

    });


    it('should clear', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createTextarea({
        onChange: onChangeSpy,
        value: 'A text area value'
      });

      // when
      const textarea = container.querySelector('textarea');

      fireEvent.input(textarea, { target: { value: '' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: ''
      });
    });

  });


  it('#create', function() {

    // assume
    const { config } = Textarea;
    expect(config.type).to.eql('textarea');
    expect(config.label).to.eql('Text area');
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

    it('should convert integers', function() {

      // given
      const { sanitizeValue } = Textarea.config;

      // when
      const sanitizedValue1 = sanitizeValue({ value: 1 });
      const sanitizedValue2 = sanitizeValue({ value: 0 });
      const sanitizedValue3 = sanitizeValue({ value: -1 });

      // then
      expect(sanitizedValue1).to.equal('1');
      expect(sanitizedValue2).to.equal('0');
      expect(sanitizedValue3).to.equal('-1');

    });


    it('should convert booleans', function() {

      // given
      const { sanitizeValue } = Textarea.config;

      // when
      const sanitizedValue1 = sanitizeValue({ value: true });
      const sanitizedValue2 = sanitizeValue({ value: false });

      // then
      expect(sanitizedValue1).to.equal('true');
      expect(sanitizedValue2).to.equal('false');

    });


    it('should convert floats', function() {

      // given
      const { sanitizeValue } = Textarea.config;

      // when
      const sanitizedValue1 = sanitizeValue({ value: 1.1 });
      const sanitizedValue2 = sanitizeValue({ value: 0.0 });
      const sanitizedValue3 = sanitizeValue({ value: -1.1 });

      // then
      expect(sanitizedValue1).to.equal('1.1');
      expect(sanitizedValue2).to.equal('0');
      expect(sanitizedValue3).to.equal('-1.1');

    });


    it('should sanitize null', function() {

      // given
      const { sanitizeValue } = Textarea.config;

      // when
      const sanitizedValue = sanitizeValue({ value: null });

      // then
      expect(sanitizedValue).to.equal('');

    });


    it('should sanitize undefined', function() {

      // given
      const { sanitizeValue } = Textarea.config;

      // when
      const sanitizedValue = sanitizeValue({ value: undefined });

      // then
      expect(sanitizedValue).to.equal('');

    });


    it('should sanitize arrays', function() {

      // given
      const { sanitizeValue } = Textarea.config;

      // when
      const sanitizedValue1 = sanitizeValue({ value: [] });
      const sanitizedValue2 = sanitizeValue({ value: [ 1, 2, 3 ] });

      // then
      expect(sanitizedValue1).to.equal('');
      expect(sanitizedValue2).to.equal('');

    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createTextarea({
        value: 'This is a textarea value /nFollowed by a newline'
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly', async function() {

      // given
      this.timeout(10000);

      const { container } = createTextarea({
        value: 'This is a textarea value /nFollowed by a newline',
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(10000);

      const { container } = createTextarea({
        value: 'This is a textarea value /nFollowed by a newline',
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const defaultField = {
  id: 'Textarea_1',
  key: 'approverComments',
  label: 'Approver Comments',
  description: 'textarea',
  type: 'textarea'
};

function createTextarea({ services, ...restOptions } = {}) {
  const options = {
    domId: 'test-textarea',
    field: defaultField,
    onChange: () => {},
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <Textarea { ...options } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}
