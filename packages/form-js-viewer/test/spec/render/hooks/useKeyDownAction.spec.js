import {
  fireEvent,
  render,
  cleanup
} from '@testing-library/preact/pure';

import useKeyDownAction from '../../../../src/render/hooks/useKeyDownAction';

const spy = sinon.spy;
let root;

describe('useKeyDownAction', function() {

  beforeEach(() => root = document.createElement('div'));

  afterEach(() => root.remove());


  it('should subscribe to key event', function() {

    // given
    var keydownActionSpy = spy();
    render(<TestComponent keydownActionSpy={ keydownActionSpy } />, root);

    // when
    fireEvent.keyDown(root, { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(root, { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(root, { key: 'ArrowDown', code: 'ArrowDown' });

    // then
    expect(keydownActionSpy).to.have.been.calledTwice;

  });


  it('should unsubscribe after cleanup', function() {

    // given
    var keydownActionSpy = spy();
    render(<TestComponent keydownActionSpy={ keydownActionSpy } />, root);
    cleanup();

    // when
    fireEvent.keyDown(root, { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(root, { key: 'ArrowUp', code: 'ArrowUp' });
    fireEvent.keyDown(root, { key: 'ArrowDown', code: 'ArrowDown' });

    // then
    expect(keydownActionSpy).to.not.have.been.called;

  });
});


const TestComponent = ({ keydownActionSpy }) => {
  useKeyDownAction('ArrowUp', keydownActionSpy, root);
  return <></>;
};