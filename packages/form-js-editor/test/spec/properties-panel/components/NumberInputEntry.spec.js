import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { NumberInputEntry } from '../../../../src/render/components/properties-panel/components';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('NumberInputEntry', function() {

  afterEach(() => cleanup());


  it('should handle change (editField & path)', function() {

    // given
    const field = { foo: 0 };

    const editFieldSpy = spy();

    const { container } = render(
      <NumberInputEntry
        editField={ editFieldSpy }
        field={ field }
        label="Foo"
        path={ [ 'foo' ] } />
    );

    // when
    const input = container.querySelector('input[type="number"]');

    expect(input.value).to.equal('0');

    fireEvent.input(input, { target: { value: '1' } });

    // then
    expect(editFieldSpy).to.have.been.calledWith(field, [ 'foo' ], 1);
  });


  it('should handle change (onChange)', function() {

    // given
    const onChangeSpy = spy();

    const { container } = render(
      <NumberInputEntry
        label="Foo"
        onChange={ onChangeSpy }
        value={ 0 } />
    );

    // when
    const input = container.querySelector('input[type="number"]');

    expect(input.value).to.equal('0');

    fireEvent.input(input, { target: { value: '1' } });

    // then
    expect(onChangeSpy).to.have.been.calledWith(1);
  });

});