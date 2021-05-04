import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { CheckboxInputEntry } from '../../../../src/rendering/properties-panel/components';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('CheckboxInputEntry', function() {

  afterEach(() => cleanup());


  it('should handle change (editField & path)', function() {

    // given
    const field = { foo: true };

    const editFieldSpy = spy();

    const { container } = render(
      <CheckboxInputEntry
        editField={ editFieldSpy }
        field={ field }
        label="Foo"
        path={ [ 'foo' ] } />
    );

    // when
    const input = container.querySelector('input[type="checkbox"]');

    expect(input.checked).to.equal(true);

    fireEvent.change(input, { target: { checked: false } });

    // then
    expect(editFieldSpy).to.have.been.calledWith(field, [ 'foo' ], false);
  });


  it('should handle change (onChange)', function() {

    // given
    const onChangeSpy = spy();

    const { container } = render(
      <CheckboxInputEntry
        label="Foo"
        onChange={ onChangeSpy }
        value={ true } />
    );

    // when
    const input = container.querySelector('input[type="checkbox"]');

    expect(input.checked).to.equal(true);

    fireEvent.change(input, { target: { checked: false } });

    // then
    expect(onChangeSpy).to.have.been.calledWith(false);
  });

});