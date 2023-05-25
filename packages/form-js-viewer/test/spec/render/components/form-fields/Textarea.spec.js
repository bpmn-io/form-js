import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Textarea from '../../../../../src/render/components/form-fields/Textarea';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

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
    expect(textarea.id).to.equal('fjs-form-foo-Textarea_1');

    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Approver Comments');
    expect(label.htmlFor).to.equal('fjs-form-foo-Textarea_1');
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


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const { container } = createTextarea({
        value: 'This is a textarea value /nFollowed by a newline'
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly', async function() {

      // given
      this.timeout(5000);

      const { container } = createTextarea({
        value: 'This is a textarea value /nFollowed by a newline',
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(5000);

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

function createTextarea(options = {}) {
  const {
    disabled,
    readonly,
    errors,
    field = defaultField,
    onChange,
    value
  } = options;

  return render(WithFormContext(
    <Textarea
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