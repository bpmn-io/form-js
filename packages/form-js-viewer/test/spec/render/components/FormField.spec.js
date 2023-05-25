import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import {
  classes
} from 'min-dom';

import FormField from 'src/render/components/FormField';

import Textfield from 'src/render/components/form-fields/Textfield';

import { FormContext } from 'src/render/context';

import { createFormContainer } from '../../../TestHelper';

let container;


const defaultData = {
  creditor: 'John Doe Company'
};

const defaultField = {
  key: 'creditor',
  _path: [ 'creditor' ],
  label: 'Creditor',
  type: 'textfield',
  conditional: {
    hide: '=someCondition'
  },
  layout: {
    columns: 8
  }
};


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
          disabled: true
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
          disabled: true
        }
      });

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: 'Jane Doe Company' } });

      // then
      expect(onChangeSpy).not.to.have.been.called;
    });

  });


  describe('readonly form', function() {

    it('should pass readonly', function() {

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
        readonly: true
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


    it('should have precedence', function() {

      // given
      const componentSpy = sinon.spy(Textfield);

      // when
      createFormField({
        field: {
          ...defaultField,
          disabled: true
        },
        FormFieldComponent: componentSpy,
        properties: {
          readOnly: true
        }
      });

      // then
      const props = componentSpy.firstCall.firstArg;

      expect(props).to.include({
        readonly: true,
        disabled: false
      });
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


  describe('readonly form field', function() {

    it('should pass readonly', function() {

      // given
      const componentSpy = sinon.spy(Textfield);

      // when
      createFormField({
        field: {
          ...defaultField,
          readonly: true
        },
        FormFieldComponent: componentSpy,
      });

      // then
      const props = componentSpy.firstCall.firstArg;

      expect(props).to.include({
        readonly: true
      });
    });


    it('should pass readonly expression', function() {

      // given
      const componentSpy = sinon.spy(Textfield);

      const expression = '=true';

      // when
      createFormField({
        field: {
          ...defaultField,
          readonly: expression
        },
        checkCondition: (value) => value === expression,
        isExpression: () => true,
        FormFieldComponent: componentSpy
      });

      // then
      const props = componentSpy.firstCall.firstArg;

      expect(props).to.include({
        readonly: true
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
          readonly: true
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


  describe('label support', function() {

    it('should display field when templating is unavailable', function() {

      // when
      const { container } = createFormField({
        isTemplate: false
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
    });

  });


  describe('condition', function() {

    it('should display field when condition checker is unavailable', function() {

      // when
      const { container } = createFormField({
        checkCondition: false
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
    });


    it('should display field for which hide condition is NOT met', function() {

      // when
      const { container } = createFormField({
        checkCondition: () => false
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
    });


    it('should NOT display field if hide condition is met', function() {

      // when
      const { container } = createFormField({
        checkCondition: () => true
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).not.to.exist;
    });


    it('should use form data to check condition', function() {

      // when
      const { container } = createFormField({
        checkCondition: (_, data) => data.shouldHide || false,
        data: {
          shouldHide: true
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).not.to.exist;
    });

  });


  describe('layout', function() {

    it('should render columns', function() {

      // when
      const { container } = createFormField();

      // then
      const layout = container.querySelector('.fjs-layout-column');

      expect(classes(layout).has('cds--col-lg-8')).to.be.true;
      expect(classes(layout).has('cds--col-sm-16')).to.be.true;
    });

  });

});

// helpers //////////

function createFormField(options = {}) {
  const {
    FormFieldComponent = Textfield,
    data = defaultData,
    errors = {},
    field = defaultField,
    initialData = {},
    onChange = () => {},
    properties = {},
    checkCondition = () => false,
    isExpression = () => false,
    isTemplate = () => false
  } = options;

  const formContext = {
    getService(type, strict = true) {
      if (type === 'formFields') {
        return {
          get(type) {
            if (type === FormFieldComponent.config.type) {
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
              initialData,
              properties
            };
          }
        };
      } else if (type === 'conditionChecker') {
        return checkCondition !== false ? {
          applyConditions(data) {
            return data;
          },
          check(...args) {
            return checkCondition(...args);
          }
        } : undefined;
      } else if (type === 'expressionLanguage') {
        return isExpression !== false ? {
          isExpression(...args) {
            return isExpression(...args);
          }
        } : undefined;
      } else if (type === 'templating') {
        return isTemplate !== false ? {
          isTemplate(...args) {
            return isTemplate(...args);
          }
        } : undefined;
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