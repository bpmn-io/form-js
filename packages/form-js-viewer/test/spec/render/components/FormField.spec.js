import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import FormField from 'src/render/components/FormField';

import Textfield from 'src/render/components/form-fields/Textfield';

import { FormContext } from 'src/render/context';

import { createFormContainer } from '../../../TestHelper';

let container;


describe('FormField', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createFormField();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-textfield')).to.be.true;
  });


  it('should pass value to form field', function() {

    // given
    const componentSpy = sinon.spy(Textfield);

    // when
    createFormField({
      FormFieldComponent: componentSpy
    });

    // then
    const props = componentSpy.firstCall.firstArg;

    expect(props).to.include({
      value: 'John Doe Company'
    });
  });


  it('should pass errors to form field', function() {

    // given
    const componentSpy = sinon.spy(Textfield);

    // when
    createFormField({
      errors: {
        creditor: [
          'foo'
        ]
      },
      FormFieldComponent: componentSpy
    });

    // then
    const props = componentSpy.firstCall.firstArg;

    expect(props).to.deep.include({
      errors:  [
        'foo'
      ]
    });
  });


  it('should should throw error if cannot render field', function() {

    expect(() => {

      // when
      createFormField({
        field: {
          type: 'foo'
        }
      });
    }).to.throw('cannot render field <foo>');
  });


  describe('disabled form', function() {

    it('should pass disabled', function() {

      // given
      const componentSpy = sinon.spy(Textfield);

      // when
      createFormField({
        FormFieldComponent: componentSpy,
        properties: {
          readOnly: true
        }
      });

      // then
      const props = componentSpy.firstCall.firstArg;

      expect(props).to.include({
        disabled: true
      });
    });


    it('should not handle change', function() {

      // given
      const componentSpy = sinon.spy(Textfield);

      const onChangeSpy = sinon.spy();

      // when
      const { container } = createFormField({
        FormFieldComponent: componentSpy,
        onChange: onChangeSpy,
        properties: {
          readOnly: true
        }
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: 'Jane Doe Company' } });

      // then
      expect(onChangeSpy).not.to.have.been.called;
    });

  });


  describe('disabled form field', function() {

    it('should pass disabled', function() {

      // given
      const componentSpy = sinon.spy(Textfield);

      // when
      createFormField({
        field: {
          ...defaultField,
          disabled: true
        },
        FormFieldComponent: componentSpy,
      });

      // then
      const props = componentSpy.firstCall.firstArg;

      expect(props).to.include({
        disabled: true
      });
    });


    it('should not handle change', function() {

      // given
      const componentSpy = sinon.spy(Textfield);

      const onChangeSpy = sinon.spy();

      // when
      const { container } = createFormField({
        field: {
          ...defaultField,
          disabled: true
        },
        FormFieldComponent: componentSpy,
        onChange: onChangeSpy
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: 'Jane Doe Company' } });

      // then
      expect(onChangeSpy).not.to.have.been.called;
    });

  });

});

// helpers //////////

const defaultData = {
  creditor: 'John Doe Company'
};

const defaultField = {
  key: 'creditor',
  label: 'Creditor',
  _path: [ 'creditor' ],
  type: 'textfield'
};

function createFormField(options = {}) {
  const {
    FormFieldComponent = Textfield,
    data = defaultData,
    errors = {},
    field = defaultField,
    onChange = () => {},
    properties = {}
  } = options;

  const formContext = {
    getService(type, strict = true) {
      if (type === 'formFields') {
        return {
          get(type) {
            if (type === FormFieldComponent.type) {
              return FormFieldComponent;
            }
          }
        };
      } else if (type === 'form') {
        return {
          _getState() {
            return {
              data,
              errors,
              properties
            };
          }
        };
      }
    }
  };

  return render(
    <FormContext.Provider value={ formContext }>
      <FormField field={ field } onChange={ onChange } />
    </FormContext.Provider>
    ,
    {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}