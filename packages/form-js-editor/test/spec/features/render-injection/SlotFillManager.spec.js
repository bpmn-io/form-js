import { SlotFillManager } from '../../../../src/features/render-injection/SlotFillManager';

describe('features/render-injection - SlotFillManager', function () {
  let eventBus;

  beforeEach(function () {
    eventBus = createEventBus();
  });

  describe('constructor', function () {
    it('should initialize with no config', function () {
      // when
      const manager = new SlotFillManager(null, eventBus);

      // then
      expect(manager.getFills('any-slot')).to.have.length(0);
    });

    it('should populate fills from config', function () {
      // given
      const render = sinon.spy();

      // when
      const manager = new SlotFillManager(
        {
          'editor-empty-state__footer': render,
        },
        eventBus,
      );

      // then
      const fills = manager.getFills('editor-empty-state__footer');
      expect(fills).to.have.length(1);
      expect(fills[0].render).to.equal(render);
    });

    it('should populate multiple fills from array config', function () {
      // given
      const render1 = sinon.spy();
      const render2 = sinon.spy();

      // when
      const manager = new SlotFillManager(
        {
          'my-slot': [render1, render2],
        },
        eventBus,
      );

      // then
      const fills = manager.getFills('my-slot');
      expect(fills).to.have.length(2);
      expect(fills[0].render).to.equal(render1);
      expect(fills[1].render).to.equal(render2);
    });

    it('should support object config with priority and group', function () {
      // given
      const render = sinon.spy();

      // when
      const manager = new SlotFillManager(
        {
          'my-slot': { render, priority: 10, group: 'custom' },
        },
        eventBus,
      );

      // then
      const fills = manager.getFills('my-slot');
      expect(fills).to.have.length(1);
      expect(fills[0].render).to.equal(render);
      expect(fills[0].priority).to.equal(10);
      expect(fills[0].group).to.equal('custom');
    });
  });

  describe('#addFill', function () {
    it('should add a fill', function () {
      // given
      const manager = new SlotFillManager(null, eventBus);
      const render = sinon.spy();

      // when
      manager.addFill('my-slot', 'my-fill', render);

      // then
      const fills = manager.getFills('my-slot');
      expect(fills).to.have.length(1);
      expect(fills[0].fillId).to.equal('my-fill');
    });

    it('should fire changed event', function () {
      // given
      const manager = new SlotFillManager(null, eventBus);
      const spy = sinon.spy();

      eventBus.on('slotFillManager.changed', spy);

      // when
      manager.addFill('my-slot', 'my-fill', sinon.spy());

      // then
      expect(spy).to.have.been.calledOnce;
    });

    it('should replace fill with same id', function () {
      // given
      const manager = new SlotFillManager(null, eventBus);
      const render1 = sinon.spy();
      const render2 = sinon.spy();

      manager.addFill('my-slot', 'my-fill', render1);

      // when
      manager.addFill('my-slot', 'my-fill', render2);

      // then
      const fills = manager.getFills('my-slot');
      expect(fills).to.have.length(1);
      expect(fills[0].render).to.equal(render2);
    });
  });

  describe('#removeFill', function () {
    it('should remove a fill', function () {
      // given
      const manager = new SlotFillManager(null, eventBus);
      manager.addFill('my-slot', 'my-fill', sinon.spy());

      // when
      manager.removeFill('my-fill');

      // then
      expect(manager.getFills('my-slot')).to.have.length(0);
    });

    it('should fire changed event', function () {
      // given
      const manager = new SlotFillManager(null, eventBus);
      manager.addFill('my-slot', 'my-fill', sinon.spy());

      const spy = sinon.spy();
      eventBus.on('slotFillManager.changed', spy);

      // when
      manager.removeFill('my-fill');

      // then
      expect(spy).to.have.been.calledOnce;
    });

    it('should NOT fire changed event if fill does not exist', function () {
      // given
      const manager = new SlotFillManager(null, eventBus);

      const spy = sinon.spy();
      eventBus.on('slotFillManager.changed', spy);

      // when
      manager.removeFill('non-existent');

      // then
      expect(spy).not.to.have.been.called;
    });
  });

  describe('#getFills', function () {
    it('should return fills sorted by group alphabetically', function () {
      // given
      const manager = new SlotFillManager(null, eventBus);
      manager.addFill('my-slot', 'fill-b', { render: sinon.spy(), group: 'b_group' });
      manager.addFill('my-slot', 'fill-a', { render: sinon.spy(), group: 'a_group' });
      manager.addFill('my-slot', 'fill-c', { render: sinon.spy(), group: 'c_group' });

      // when
      const fills = manager.getFills('my-slot');

      // then
      expect(fills.map((f) => f.group)).to.eql(['a_group', 'b_group', 'c_group']);
    });

    it('should return fills sorted by priority within same group', function () {
      // given
      const manager = new SlotFillManager(null, eventBus);
      manager.addFill('my-slot', 'fill-low', { render: sinon.spy(), priority: -1, group: 'same' });
      manager.addFill('my-slot', 'fill-high', { render: sinon.spy(), priority: 100, group: 'same' });
      manager.addFill('my-slot', 'fill-default', { render: sinon.spy(), group: 'same' });

      // when
      const fills = manager.getFills('my-slot');

      // then
      expect(fills.map((f) => f.fillId)).to.eql(['fill-high', 'fill-default', 'fill-low']);
    });

    it('should only return fills for the requested slot', function () {
      // given
      const manager = new SlotFillManager(null, eventBus);
      manager.addFill('slot-a', 'fill-1', sinon.spy());
      manager.addFill('slot-b', 'fill-2', sinon.spy());

      // when / then
      expect(manager.getFills('slot-a')).to.have.length(1);
      expect(manager.getFills('slot-b')).to.have.length(1);
      expect(manager.getFills('slot-c')).to.have.length(0);
    });
  });
});

// helpers //////////

function createEventBus() {
  const listeners = {};

  return {
    on(event, callback) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    },
    off(event, callback) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((cb) => cb !== callback);
      }
    },
    fire(event, data) {
      if (listeners[event]) {
        listeners[event].forEach((cb) => cb(data));
      }
    },
  };
}
