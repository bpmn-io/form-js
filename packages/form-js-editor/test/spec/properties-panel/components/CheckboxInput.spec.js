import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { CheckboxInput } from '../../../../src/rendering/properties-panel/components';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('CheckboxInput', function() {

  afterEach(() => cleanup());


  it('should render', function() {

    // when
    const { container } = render(<CheckboxInput value={ true } />);

    // then
    const input = container.querySelector('input[type="checkbox"]');

    expect(input).to.exist;
    expect(input.checked).to.be.true;
  });


  it('should handle change', function() {

    // given
    const onChangeSpy = spy();

    const { container } = render(
      <CheckboxInput
        value={ false }
        onChange={ onChangeSpy } />
    );

    // when
    const input = container.querySelector('input[type="checkbox"]');

    fireEvent.change(input, { target: { checked: true } });

    // then
    expect(input.checked).to.be.true;

    expect(onChangeSpy).to.have.been.calledWith(true);
  });

});