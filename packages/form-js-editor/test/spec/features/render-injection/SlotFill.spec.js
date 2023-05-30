import {
  render,
  fireEvent
} from '@testing-library/preact/pure';

import { useState } from 'preact/hooks';

import {
  SlotFillRoot,
  Fill,
  Slot,
  FillContext,
  SlotContext
} from '../../../../src/features/render-injection/slot-fill';


describe('slot-fill', function() {
  let container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });

  describe('<SlotFillRoot>', function() {

    it('should have access to fill context', function() {
      render(
        <SlotFillRoot>
          <FillContext.Consumer>
            {(fillContext) => {
              expect(fillContext).to.exist;
              expect(fillContext.addFill).to.exist;
              expect(fillContext.removeFill).to.exist;
            }}
          </FillContext.Consumer>
        </SlotFillRoot>,
        { container }
      );
    });


    it('should have access to slot context', function() {
      render(
        <SlotFillRoot>
          <SlotContext.Consumer>
            {(slotContext) => {
              expect(slotContext).to.exist;
              expect(slotContext.fills).to.exist;
            }}
          </SlotContext.Consumer>
        </SlotFillRoot>,
        { container }
      );
    });
  });


  describe('<Fill>', function() {

    it('should register fill', function() {

      // given
      const spy = sinon.spy();

      // when
      render(
        <SlotFillRoot onSetFill={ spy }>
          <Fill />
        </SlotFillRoot>,
        { container }
      );

      // then
      expect(spy).to.have.been.calledOnce;
    });


    it('should unregister fill', function() {

      // given
      const spy = sinon.spy();

      const { rerender } = render(
        <SlotFillRoot onRemoveFill={ spy }>
          <RenderChildren renderChildren={ true }>
            <Fill />
          </RenderChildren>
        </SlotFillRoot>,
        { container }
      );

      // when
      rerender(
        <SlotFillRoot>
          <RenderChildren renderChildren={ false }>
            <Fill />
          </RenderChildren>
        </SlotFillRoot>
      );


      // then
      expect(spy).to.have.been.calledOnce;
    });


    it('should update fill', function() {

      // given
      render(
        <SlotFillRoot>
          <Fill slot="foo">
            <RenderButtons />
          </Fill>
          <Slot name="foo" />
        </SlotFillRoot>,
        { container }
      );

      const fooButton = container.querySelector('#foo');
      const barButton = container.querySelector('#bar');

      expect(fooButton).to.exist;
      expect(barButton).to.exist;

      // when
      fireEvent.click(container.querySelector('#foo'));

      // then
      expect(container.querySelector('#foo')).to.exist;
      expect(container.querySelector('#bar')).to.not.exist;
    });
  });


  describe('<Slot>', function() {

    it('should render fills', function() {

      // given
      render(
        <SlotFillRoot>
          <Fill slot="foo">
            <div className="fill" />
          </Fill>
          <div className="slot">
            <Slot name="foo" />
          </div>
        </SlotFillRoot>,
        { container }
      );

      const fill = container.querySelector('.fill');
      const slot = container.querySelector('.slot');

      // then
      expect(slot.contains(fill)).to.be.true;
    });


    describe('ordering', function() {

      it('should display fills ordered alphabetically by group', function() {

        // given
        const unorderedFills = [
          '1_a',
          '2_b',
          '3_a',
          'foo',
          '2_a',
        ].map((id) => (
          <Fill slot="foo" group={ id } key={ id }>
            <div className="fill" id={ id } />
          </Fill>
        ));

        // when
        render(
          <SlotFillRoot>
            {unorderedFills}
            <div className="slot">
              <Slot name="foo" />
            </div>
          </SlotFillRoot>,
          { container }
        );

        const fills = Array.from(container.querySelectorAll('.fill'));
        const slot = container.querySelector('.slot');

        // then
        expect(fills.every((fill) => slot.contains(fill))).to.be.true;
        expect(fills.map((fill) => fill.id)).to.eql([
          '1_a',
          '2_a',
          '2_b',
          '3_a',
          'foo',
        ]);
      });


      it('should display fills ordered by priority inside the same group', function() {

        // when
        render(
          <SlotFillRoot>
            <Fill slot="foo" group="1_a" priority={ -1 }>
              <div className="fill" id="low_priority" />
            </Fill>
            <Fill slot="foo" group="1_a">
              <div className="fill" id="no_priority" />
            </Fill>
            <Fill slot="foo" group="1_a" priority={ 100 }>
              <div className="fill" id="high_priority" />
            </Fill>
            <div className="slot">
              <Slot name="foo" />
            </div>
          </SlotFillRoot>,
          { container }
        );

        const fills = Array.from(container.querySelectorAll('.fill'));
        const slot = container.querySelector('.slot');

        // then
        expect(fills.every((fill) => slot.contains(fill))).to.be.true;
        expect(fills.map((fill) => fill.id)).to.eql([
          'high_priority',
          'no_priority',
          'low_priority',
        ]);
      });
    });
  });
});


function RenderChildren(props) {
  return (
    <>
      { props.renderChildren && props.children}
    </>
  );
}

const RenderButtons = () => {
  const [ renderButton, setRenderButton ] = useState(true);

  return (
    <>
      <button onClick={ () => setRenderButton(false) } id="foo">Foo</button>
      {renderButton && <button id="bar">Bar</button>}
    </>
  );
};
