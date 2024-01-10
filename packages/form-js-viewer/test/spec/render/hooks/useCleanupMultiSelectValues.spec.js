import {
  render,
} from '@testing-library/preact/pure';

import { useCleanupMultiSelectValue } from '../../../../src/render/hooks/useCleanupMultiSelectValue';

const spy = sinon.spy;
let root;

describe('useCleanupMultiSelectValue', function() {

  beforeEach(() => root = document.createElement('div'));

  afterEach(() => root.remove());

  it('should fire onChange when any value is no longer in the options', function() {

    // given
    const onChangeSpy = spy();
    const values = [ 'camunda-platform', 'camunda-cloud' ];

    const { rerender } = render(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } values={ values } />, {
        container: root
      });

    // when
    rerender(
      <TestComponent onChangeSpy={ onChangeSpy } options={ noPlatformOptions } values={ values } />, {
        container: root
      }
    );

    // then
    expect(onChangeSpy).to.have.been.calledOnce;
    expect(onChangeSpy).to.have.been.calledWith({
      field: 'foo',
      value: [ 'camunda-cloud' ]
    });

  });


  it('should not fire onChange when all values are still in the options', function() {

    // given
    const onChangeSpy = spy();
    const values = [ 'camunda-platform', 'camunda-cloud' ];

    const { rerender } = render(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } values={ values } />, {
        container: root
      });

    // when
    rerender(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } values={ values } />, {
        container: root
      }
    );

    // then
    expect(onChangeSpy).to.not.have.been.called;

  });


  it('should not reinstate the removed values when the options change back', function() {

    // given
    const onChangeSpy = spy();
    const values = [ 'camunda-platform', 'camunda-cloud' ];

    const { rerender } = render(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } values={ values } />, {
        container: root
      });

    // when
    rerender(
      <TestComponent onChangeSpy={ onChangeSpy } options={ noPlatformOptions } values={ values } />, {
        container: root
      }
    );

    rerender(
      <TestComponent onChangeSpy={ onChangeSpy } options={ baseOptions } values={ values } />, {
        container: root
      }
    );

    // then
    expect(onChangeSpy).to.have.been.calledOnce;
    expect(onChangeSpy).to.have.been.calledWith({
      field: 'foo',
      value: [ 'camunda-cloud' ]
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

function TestComponent({ onChangeSpy, options, values }) {

  useCleanupMultiSelectValue({
    field: 'foo',
    loadState: 'loaded',
    onChange: onChangeSpy,
    options,
    values
  });

  return <></>;
}
