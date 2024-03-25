import {
  render
} from '@testing-library/preact/pure';

import { JSFunctionField } from '../../../../../src/render/components/form-fields/JSFunctionField';

import { MockFormContext } from '../helper';

import { act } from 'preact/test-utils';

import {
  createFormContainer
} from '../../../../TestHelper';

let container;

describe('JSFunctionField', function() {

  beforeEach(function() {
    container = createFormContainer();
  });


  afterEach(function() {
    container.remove();
  });


  it('should evaluate with setValue', async function() {

    // given
    const onChangeSpy = sinon.spy();
    const field = defaultField;
    const passedData = { value : 42 };

    const services = {
      expressionLanguage: {
        isExpression: () => true,
        evaluate: () => {
          return passedData;
        }
      }
    };

    // when
    act(() => {
      createJSFunctionField({ field, onChange: onChangeSpy, services });
    });

    // wait for the iframe to compute the expression and pass it back
    await new Promise(r => setTimeout(r, 100)).then(() => {

      // then
      expect(onChangeSpy).to.be.calledOnce;
      expect(onChangeSpy).to.be.calledWith({ field, value: 42 });
    });

  });


  it('should evaluate with return', async function() {

    // given
    const onChangeSpy = sinon.spy();
    const field = {
      ...defaultField,
      jsFunction: 'return data.value'
    };
    const passedData = { value : 42 };

    const services = {
      expressionLanguage: {
        isExpression: () => true,
        evaluate: () => {
          return passedData;
        }
      }
    };

    // when
    act(() => {
      createJSFunctionField({ field, onChange: onChangeSpy, services });
    });

    // wait for the iframe to compute the expression and pass it back
    await new Promise(r => setTimeout(r, 100)).then(() => {

      // then
      expect(onChangeSpy).to.be.calledOnce;
      expect(onChangeSpy).to.be.calledWith({ field, value: 42 });
    });

  });


  it('should evaluate multiple times when using interval', async function() {

    // given
    const onChangeSpy = sinon.spy();
    const field = {
      ...defaultField,
      computeOn: 'interval',
      interval: 100
    };
    const passedData = { value : 42 };

    const services = {
      expressionLanguage: {
        isExpression: () => true,
        evaluate: () => {
          return passedData;
        }
      }
    };

    // when
    act(() => {
      createJSFunctionField({ field, onChange: onChangeSpy, services });
    });

    // wait for the iframe to compute the expression and pass it back
    await new Promise(r => setTimeout(r, 500)).then(() => {

      // then

      // deliberately underestimating the number of calls to account for potential timing issues
      expect(onChangeSpy.callCount > 3).to.be.true;
      expect(onChangeSpy).to.be.calledWith({ field, value: 42 });
    });


  });

});

// helpers //////////

const defaultField = {
  type: 'script',
  key: 'jsfunction',
  jsFunction: 'setValue(data.value)',
  computeOn: 'load'
};

function createJSFunctionField({ services, ...restOptions } = {}) {
  const options = {
    field: defaultField,
    onChange: () => {},
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <JSFunctionField
        field={ options.field }
        onChange={ options.onChange } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}