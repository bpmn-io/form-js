import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { Textarea } from '../../../../src/render/components/properties-panel/components';

import { WithFormEditorContext } from '../helper';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('Textarea', function() {

  afterEach(() => cleanup());


  it('should render', function() {

    // when
    const { container } = render(WithFormEditorContext(<Textarea value="foo" />));

    // then
    const textarea = container.querySelector('textarea');

    expect(textarea).to.exist;
    expect(textarea.value).to.equal('foo');
  });


  it('should handle input (string)', function() {

    // given
    const onInputSpy = spy();

    const { container } = render(WithFormEditorContext(
      <Textarea
        value="foo"
        onInput={ onInputSpy } />
    ));

    // when
    const textarea = container.querySelector('textarea');

    fireEvent.input(textarea, { target: { value: 'bar' } });

    // then
    expect(textarea.value).to.equal('bar');

    expect(onInputSpy).to.have.been.calledWith('bar');
  });


  it('should handle input (undefined)', function() {

    // given
    const onInputSpy = spy();

    const { container } = render(WithFormEditorContext(
      <Textarea
        value="foo"
        onInput={ onInputSpy } />
    ));

    // when
    const textarea = container.querySelector('textarea');

    fireEvent.input(textarea, { target: { value: '' } });

    // then
    expect(textarea.value).to.equal('');

    expect(onInputSpy).to.have.been.calledWith(undefined);
  });

});