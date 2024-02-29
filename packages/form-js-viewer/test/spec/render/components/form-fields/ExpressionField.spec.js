import {
  render
} from '@testing-library/preact/pure';

import { ExpressionField } from '../../../../../src/render/components/form-fields/ExpressionField';

import { MockFormContext } from '../helper';
import { EventBusMock } from '../helper/mocks';
import { act } from 'preact/test-utils';

import {
  createFormContainer
} from '../../../../TestHelper';

let container;

describe('ExpressionField', function() {

  beforeEach(function() {
    container = createFormContainer();
  });


  afterEach(function() {
    container.remove();
  });


  it('should evaluate its expression on initialization when set to onChange', function() {

    // given
    const field = {
      ...defaultField,
      expression: '=1 + 1'
    };

    const services = {
      expressionLanguage: {
        isExpression: () => true,
        evaluate: () => {
          return 1 + 1;
        }
      }
    };

    const onChangeSpy = sinon.spy();

    // when
    act(() => {
      createExpressionField({ field, onChange: onChangeSpy, services });
    });

    // then
    expect(onChangeSpy.calledWith({ field, value: 2 })).to.be.true;

  });


  it('should re-evaluate when the expression result changes', function() {

    // given
    const field = {
      ...defaultField,
      expression: '=1 + 1'
    };

    const services = {
      expressionLanguage: {
        isExpression: () => true,
        evaluate: () => {
          return 1 + 1;
        }
      }
    };

    const onChangeSpy = sinon.spy();

    services.expressionLanguage.evaluate = () => {
      return 1 + 2;
    };

    const { rerender } = createExpressionField({ field, onChange: onChangeSpy, services });

    // when
    act(() => {
      rerender(
        <MockFormContext
          services={ services }
          options={ {
            field: {
              ...field,
              expression: '=1 + 2'
            },
            onChange: onChangeSpy
          } }>
          <ExpressionField
            field={ field }
            onChange={ onChangeSpy } />
        </MockFormContext>
      );
    });

    // then
    expect(onChangeSpy.calledWith({ field, value: 3 })).to.be.true;

  });


  it('should not evaluate on intialization if computeOn presubmit', function() {

    // given
    const field = {
      ...defaultField,
      computeOn: 'presubmit',
      expression: '=1 + 1'
    };

    const services = {
      expressionLanguage: {
        isExpression: () => true,
        evaluate: () => {
          return 1 + 1;
        }
      },
      eventBus: new EventBusMock()
    };

    const onChangeSpy = sinon.spy();

    // when
    act(() => {
      createExpressionField({ field, onChange: onChangeSpy, services });
    });

    // then
    expect(onChangeSpy.called).to.be.false;

  });


  it('should evaluate on presubmit', function() {

    // given
    const field = {
      ...defaultField,
      computeOn: 'presubmit',
      expression: '=1 + 1'
    };

    const services = {
      expressionLanguage: {
        isExpression: () => true,
        evaluate: () => {
          return 1 + 1;
        }
      },
      eventBus: new EventBusMock()
    };

    const onChangeSpy = sinon.spy();

    createExpressionField({ field, onChange: onChangeSpy, services });

    // when
    act(() => {
      services.eventBus.fire('presubmit');
    });

    // then
    expect(onChangeSpy.calledWith({ field, value: 2 })).to.be.true;

  });

});

// helpers //////////

const defaultField = {
  type: 'expression',
  key: 'expressionResult',
  computeOn: 'change',
  expression: ''
};

function createExpressionField({ services, ...restOptions } = {}) {
  const options = {
    field: defaultField,
    onChange: () => {},
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <ExpressionField
        field={ options.field }
        onChange={ options.onChange } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}