import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { NumberInput } from '../../../../src/render/components/properties-panel/components';

import { WithFormEditorContext } from './Util';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('NumberInput', function() {

  afterEach(() => cleanup());


  it('should render', function() {

    // when
    const { container } = render(WithFormEditorContext(<NumberInput value={ 123 } />));

    // then
    const input = container.querySelector('input[type="number"]');

    expect(input).to.exist;
    expect(input.value).to.equal('123');
  });


  it('should handle input (number)', function() {

    // given
    const onInputSpy = spy();

    const { container } = render(WithFormEditorContext(
      <NumberInput
        value={ 123 }
        onInput={ onInputSpy } />
    ));

    // when
    const input = container.querySelector('input[type="number"]');

    fireEvent.input(input, { target: { value: '124' } });

    // then
    expect(input.value).to.equal('124');

    expect(onInputSpy).to.have.been.calledWith(124);
  });


  it('should handle input (undefined)', function() {

    // given
    const onInputSpy = spy();

    const { container } = render(WithFormEditorContext(
      <NumberInput
        value={ 123 }
        onInput={ onInputSpy } />
    ));

    // when
    const input = container.querySelector('input[type="number"]');

    fireEvent.input(input, { target: { value: '' } });

    // then
    expect(input.value).to.equal('');

    expect(onInputSpy).to.have.been.calledWith(undefined);
  });

});