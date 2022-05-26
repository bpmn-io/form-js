import { render } from '@testing-library/preact/pure';

import Fieldset from '../../../../../src/render/components/form-fields/Fieldset';
import Textfield from '../../../../../src/render/components/form-fields/Textfield';
import { FormContext } from '../../../../../src/render/context';

import { createFormContainer } from '../../../../TestHelper';


let container;

describe('Fieldset', function() {
  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });

  it('should render', function() {

    // when
    const { container } = createFieldset();

    // then
    const label = container.querySelector('legend');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Default');
  });

  it('should render with children', function() {

    // when
    const { container } = createFieldset({
      field: {
        label: 'Default',
        type: 'fieldset',
        components: [
          {
            id: 'Textfield_1',
            key: 'creditor',
            label: 'Creditor',
            _path: [ 'creditor' ],
            type: 'textfield'
          },
        ]
      }
    });

    // then
    const label = container.querySelector('legend');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Default');

    const input = container.querySelector('input[type="text"]');
    expect(input).to.exist;
    expect(input.id).to.equal('fjs-form-foo-Textfield_1');
  });
});



// helpers //////////

const defaultData = {
  creditor: 'John Doe Company'
};

const defaultField = {
  label: 'Default',
  type: 'fieldset',
};

function createFieldset(options = {}) {
  const {
    FormFieldComponent = Textfield,
    data = defaultData,
    errors = {},
    field = defaultField,
    properties = {}
  } = options;

  const formContext = {
    formId: 'foo',
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
      <Fieldset field={ field } />
    </FormContext.Provider>
    ,
    {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}