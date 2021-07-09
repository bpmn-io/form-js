import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { TextInput } from '../../../../src/render/components/properties-panel/components';

import { WithFormEditorContext } from './Util';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('TextInput', function() {

  afterEach(() => cleanup());


  it('should render', function() {

    // when
    const { container } = render(WithFormEditorContext(<TextInput value="foo" />));

    // then
    const input = container.querySelector('input[type="text"]');

    expect(input).to.exist;
    expect(input.value).to.equal('foo');
  });


  it('should handle input (string)', function() {

    // given
    const onInputSpy = spy();

    const { container } = render(WithFormEditorContext(
      <TextInput
        value="foo"
        onInput={ onInputSpy } />
    ));

    // when
    const input = container.querySelector('input[type="text"]');

    fireEvent.input(input, { target: { value: 'bar' } });

    // then
    expect(input.value).to.equal('bar');

    expect(onInputSpy).to.have.been.calledWith('bar');
  });


  it('should handle input (undefined)', function() {

    // given
    const onInputSpy = spy();

    const { container } = render(WithFormEditorContext(
      <TextInput
        value="foo"
        onInput={ onInputSpy } />
    ));

    // when
    const input = container.querySelector('input[type="text"]');

    fireEvent.input(input, { target: { value: '' } });

    // then
    expect(input.value).to.equal('');

    expect(onInputSpy).to.have.been.calledWith(undefined);
  });


  describe('validate', function() {

    it('should validate', function() {

      // given
      const onInputSpy = spy(),
            validateSpy = spy(() => null);

      const { container } = render(WithFormEditorContext(
        <TextInput
          value="foo"
          onInput={ onInputSpy }
          validate={ validateSpy } />
      ));

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: 'bar' } });

      // then
      expect(input.value).to.equal('bar');

      expect(onInputSpy).to.have.been.called;
      expect(validateSpy).to.have.been.called;
    });


    it('should not call callback if has error', function() {

      // given
      const onInputSpy = spy(),
            validateSpy = spy(() => 'error');

      const { container } = render(WithFormEditorContext(
        <TextInput
          value="foo"
          onInput={ onInputSpy }
          validate={ validateSpy } />
      ));

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: 'bar' } });

      // then
      expect(input.value).to.equal('bar');

      expect(onInputSpy).not.to.have.been.called;
      expect(validateSpy).to.have.been.called;
    });


    it('should show error', function() {

      // given
      const onInputSpy = spy(),
            validateSpy = spy(() => 'error');

      const { container } = render(WithFormEditorContext(
        <TextInput
          value="foo"
          onInput={ onInputSpy }
          validate={ validateSpy } />
      ));

      // when
      const input = container.querySelector('input[type="text"]');

      fireEvent.input(input, { target: { value: 'bar' } });

      // then
      const error = container.querySelector('.fjs-properties-panel-error');

      expect(error).to.exist;
      expect(error.textContent).to.equal('error');
    });

  });

});
