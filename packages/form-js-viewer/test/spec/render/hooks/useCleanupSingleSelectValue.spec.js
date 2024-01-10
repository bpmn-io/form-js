import {
  render,
} from '@testing-library/preact/pure';

import { useCleanupSingleSelectValue } from '../../../../src/render/hooks/useCleanupSingleSelectValue';

const spy = sinon.spy;
let root;

describe('useCleanupSingleSelectValue', function() {

  beforeEach(() => root = document.createElement('div'));

  afterEach(() => root.remove());

  it('should fire onChange when the value is no longer in the options', function() {

    // given
    const onChangeSpy = spy();
    const value = 'camunda-platform';

    const { rerender } = render(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } value={ value } />, {
        container: root
      });

    // when
    rerender(
      <TestComponent onChangeSpy={ onChangeSpy } options={ noPlatformOptions } value={ value } />, {
        container: root
      }
    );

    // then
    expect(onChangeSpy).to.have.been.calledOnce;
    expect(onChangeSpy).to.have.been.calledWith({
      field: 'foo',
      value: null
    });

  });


  it('should not fire onChange when the value is still in the options', function() {

    // given
    const onChangeSpy = spy();
    const value = 'camunda-platform';

    const { rerender } = render(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } value={ value } />, {
        container: root
      });

    // when
    rerender(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } value={ value } />, {
        container: root
      }
    );

    // then
    expect(onChangeSpy).to.not.have.been.called;

  });


  it('should not reinstate the value when the options change back', function() {

    // given
    const onChangeSpy = spy();
    const value = 'camunda-platform';

    const { rerender } = render(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } value={ value } />, {
        container: root
      });

    // when
    rerender(
      <TestComponent onChangeSpy={ onChangeSpy } options={ noPlatformOptions } value={ value } />, {
        container: root
      }
    );

    rerender(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } value={ value } />, {
        container: root
      }
    );

    // then
    expect(onChangeSpy).to.have.been.calledOnce;
    expect(onChangeSpy).to.have.been.calledWith({
      field: 'foo',
      value: null
    });

  });

});

const baseOptions = [
  { value: 'camunda-platform', label: 'Camunda Platform' },
  { value: 'camunda-cloud', label: 'Camunda Cloud' }
];

const noPlatformOptions = [
  { value: 'camunda-cloud', label: 'Camunda Cloud' }
];

function TestComponent({ onChangeSpy, options, value }) {

  useCleanupSingleSelectValue({
    field: 'foo',
    loadState: 'loaded',
    onChange: onChangeSpy,
    options,
    value
  });

  return <></>;
}