import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { TextareaEntry } from '../../../../src/render/components/properties-panel/components';

import { WithFormEditorContext } from './Util';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('TextareaEntry', function() {

  afterEach(() => cleanup());


  it('should handle change (editField & path)', function() {

    // given
    const field = { foo: 'foo' };

    const editFieldSpy = spy();

    const { container } = render(WithFormEditorContext(
      <TextareaEntry
        editField={ editFieldSpy }
        field={ field }
        label="Foo"
        path={ [ 'foo' ] } />
    ));

    // when
    const textarea = container.querySelector('textarea');

    expect(textarea.value).to.equal('foo');

    fireEvent.input(textarea, { target: { value: 'bar' } });

    // then
    expect(editFieldSpy).to.have.been.calledWith(field, [ 'foo' ], 'bar');
  });


  it('should handle change (onChange)', function() {

    // given
    const onChangeSpy = spy();

    const { container } = render(WithFormEditorContext(
      <TextareaEntry
        label="Foo"
        onChange={ onChangeSpy }
        value={ 'foo' } />
    ));

    // when
    const textarea = container.querySelector('textarea');

    expect(textarea.value).to.equal('foo');

    fireEvent.input(textarea, { target: { value: 'bar' } });

    // then
    expect(onChangeSpy).to.have.been.calledWith('bar');
  });

});