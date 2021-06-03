import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { TextInputEntry } from '../../../../src/render/components/properties-panel/components';

import { WithFormEditorContext } from './Util';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('TextInputEntry', function() {

  afterEach(() => cleanup());


  it('should handle change (editField & path)', function() {

    // given
    const field = { foo: 'foo' };

    const editFieldSpy = spy();

    const { container } = render(WithFormEditorContext(
      <TextInputEntry
        editField={ editFieldSpy }
        field={ field }
        label="Foo"
        path={ [ 'foo' ] } />
    ));

    // when
    const input = container.querySelector('input[type="text"]');

    expect(input.value).to.equal('foo');

    fireEvent.input(input, { target: { value: 'bar' } });

    // then
    expect(editFieldSpy).to.have.been.calledWith(field, [ 'foo' ], 'bar');
  });


  it('should handle change (onChange)', function() {

    // given
    const onChangeSpy = spy();

    const { container } = render(WithFormEditorContext(
      <TextInputEntry
        label="Foo"
        onChange={ onChangeSpy }
        value={ 'foo' } />
    ));

    // when
    const input = container.querySelector('input[type="text"]');

    expect(input.value).to.equal('foo');

    fireEvent.input(input, { target: { value: 'bar' } });

    // then
    expect(onChangeSpy).to.have.been.calledWith('bar');
  });

});