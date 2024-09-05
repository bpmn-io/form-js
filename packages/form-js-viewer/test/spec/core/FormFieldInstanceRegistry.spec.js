import { bootstrapForm, getForm, inject } from 'test/TestHelper';

describe('FormFieldInstanceRegistry', function () {
  beforeEach(bootstrapForm());

  afterEach(function () {
    getForm().destroy();
  });

  describe('#syncInstance', function () {
    it('should add form field instance on sync', inject(function (formFieldRegistry, formFieldInstanceRegistry) {
      // given
      const formField = {
        id: 'foo',
      };

      // when
      formFieldRegistry.add(formField);
      const key = formFieldInstanceRegistry.syncInstance('instanceKey', {
        id: formField.id,
        expressionContextInfo: {},
        valuePath: ['foo'],
        indexes: {},
      });

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(1);
      expect(key).to.equal('instanceKey');
    }));

    it('should not add form field instance on hidden', inject(function (formFieldRegistry, formFieldInstanceRegistry) {
      // given
      formFieldRegistry.add(simpleFormField);

      // when
      formFieldInstanceRegistry.syncInstance('instanceKey', { ...simpleInstance, hidden: true });

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(0);
    }));

    it('should remove form field instance on hidden', inject(function (formFieldRegistry, formFieldInstanceRegistry) {
      // given
      formFieldRegistry.add(simpleFormField);
      formFieldInstanceRegistry.syncInstance('instanceKey', simpleInstance);

      // when
      formFieldInstanceRegistry.syncInstance('instanceKey', { ...simpleInstance, hidden: true });

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(0);
    }));

    it('should sync separate instances', inject(function (formFieldRegistry, formFieldInstanceRegistry) {
      // given
      formFieldRegistry.add(simpleFormField);

      // when
      formFieldInstanceRegistry.syncInstance('instanceKey1', simpleInstance);
      formFieldInstanceRegistry.syncInstance('instanceKey2', simpleInstance);

      // then
      const savedInstances = formFieldInstanceRegistry.getAll();
      expect(savedInstances).to.have.length(2);
      expect(savedInstances.map(({ id }) => id)).to.eql([simpleFormField.id, simpleFormField.id]);
      expect(savedInstances.map(({ instanceId }) => instanceId)).to.eql(['instanceKey1', 'instanceKey2']);
    }));
  });

  describe('#clear', function () {
    it('should clear', inject(function (formFieldInstanceRegistry) {
      // given
      formFieldInstanceRegistry.syncInstance('instanceKey', simpleInstance);

      // when
      formFieldInstanceRegistry.clear();

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(0);
    }));

    it('should clear on form.clear', inject(function (eventBus, formFieldInstanceRegistry) {
      // given
      formFieldInstanceRegistry.syncInstance('instanceKey', simpleInstance);

      // when
      eventBus.fire('form.clear');

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(0);
    }));
  });

  it('#cleanupInstance - should remove instance', inject(function (formFieldRegistry, formFieldInstanceRegistry) {
    // given
    formFieldRegistry.add(simpleFormField);
    const formFieldInstanceKey = formFieldInstanceRegistry.syncInstance('instancekey', simpleInstance);

    // when
    formFieldInstanceRegistry.cleanupInstance(formFieldInstanceKey);

    // then
    expect(formFieldInstanceRegistry.getAll()).to.have.length(0);
  }));

  it('#getAllKeyed - should get all keyed', inject(function (formFields, formFieldRegistry, formFieldInstanceRegistry) {
    // given
    formFields.get = (type) => (type === 'keyedType' ? { config: { keyed: true } } : { config: { keyed: false } });
    formFieldRegistry.add(simpleFormField);
    formFieldRegistry.add({ id: 'bar', type: 'keyedType' });

    formFieldInstanceRegistry.syncInstance('instanceKey1', simpleInstance);
    formFieldInstanceRegistry.syncInstance('instanceKey2', { ...simpleInstance, id: 'bar' });

    // when
    const keyedInstances = formFieldInstanceRegistry.getAllKeyed();

    // then
    expect(keyedInstances).to.have.length(1);
    expect(keyedInstances[0].id).to.equal('bar');
  }));
});

// helpers

const simpleFormField = {
  id: 'foo',
};

const simpleInstance = {
  id: simpleFormField.id,
  expressionContextInfo: {},
  valuePath: ['foo'],
  indexes: {},
};
