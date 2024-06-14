import { bootstrapForm, getForm, inject } from 'test/TestHelper';

describe('FormFieldInstanceRegistry', function () {
  beforeEach(bootstrapForm());

  afterEach(function () {
    getForm().destroy();
  });

  describe('#add', function () {
    it('should add form field', inject(function (formFieldRegistry, formFieldInstanceRegistry) {
      // given
      const formField = {
        id: 'foo',
      };

      // when
      formFieldRegistry.add(formField);
      const key = formFieldInstanceRegistry.add({
        id: formField.id,
        expressionContextInfo: {},
        valuePath: ['foo'],
        indexes: {},
      });

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(1);
      expect(key).to.equal('foo');
    }));

    it('should use indexes for instance ID', inject(function (formFieldRegistry, formFieldInstanceRegistry) {
      // given
      const formField = {
        id: 'foo',
      };

      // when
      formFieldRegistry.add(formField);
      const key = formFieldInstanceRegistry.add({
        id: formField.id,
        expressionContextInfo: {},
        valuePath: ['foo'],
        indexes: {
          bar: 2,
        },
      });

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(1);
      expect(key).to.equal('foo_2');
    }));

    it('should throw error if form field with ID already exists', inject(function (
      formFieldRegistry,
      formFieldInstanceRegistry,
    ) {
      // given
      const formField = {
        id: 'foo',
      };

      formFieldRegistry.add(formField);
      formFieldInstanceRegistry.add({
        id: formField.id,
        expressionContextInfo: {},
        valuePath: ['foo'],
        indexes: {},
      });

      // when
      // then
      expect(() =>
        formFieldInstanceRegistry.add({
          id: formField.id,
          expressionContextInfo: {},
          valuePath: ['foo'],
          indexes: {},
        }),
      ).to.throw('this form field instance is already registered');
    }));

    it('should not throw error when two form fields with same ID with different indexes are added', inject(function (
      formFieldRegistry,
      formFieldInstanceRegistry,
    ) {
      // given
      const formField = {
        id: 'foo',
      };

      formFieldRegistry.add(formField);
      formFieldInstanceRegistry.add({
        id: formField.id,
        expressionContextInfo: {},
        valuePath: ['foo'],
        indexes: { bar: 1 },
      });

      // when
      // then
      expect(() =>
        formFieldInstanceRegistry.add({
          id: formField.id,
          expressionContextInfo: {},
          valuePath: ['foo'],
          indexes: { bar: 2 },
        }),
      ).not.to.throw();
    }));
  });

  describe('#remove', function () {
    let formField;
    let formFieldInstanceKey;

    beforeEach(inject(function (formFieldRegistry, formFieldInstanceRegistry) {
      formField = {
        id: 'foo',
      };

      formFieldRegistry.add(formField);
      formFieldInstanceKey = formFieldInstanceRegistry.add({
        id: formField.id,
        expressionContextInfo: {},
        valuePath: ['foo'],
        indexes: {},
      });
    }));

    it('should remove form field', inject(function (formFieldInstanceRegistry) {
      // when
      formFieldInstanceRegistry.remove(formFieldInstanceKey);

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(0);
    }));
  });

  describe('#getAll', function () {
    let formField1, formField2;

    beforeEach(inject(function (formFieldRegistry, formFieldInstanceRegistry) {
      formField1 = {
        id: 'foo',
      };

      formFieldRegistry.add(formField1);
      formFieldInstanceRegistry.add({
        id: formField1.id,
        expressionContextInfo: {},
        valuePath: ['foo'],
        indexes: {},
      });

      formField2 = {
        id: 'bar',
      };

      formFieldRegistry.add(formField2);
      formFieldInstanceRegistry.add({
        id: formField2.id,
        expressionContextInfo: {},
        valuePath: ['bar'],
        indexes: {},
      });
    }));

    it('should get all form fields', inject(function (formFieldInstanceRegistry) {
      // when
      const formFieldInstances = formFieldInstanceRegistry.getAll();

      // then
      expect(formFieldInstances).to.have.length(2);
      expect(formFieldInstances.map(({ id }) => id)).to.eql([formField1.id, formField2.id]);
    }));
  });

  describe('#clear', function () {
    let formField1, formField2;

    beforeEach(inject(function (formFieldRegistry, formFieldInstanceRegistry) {
      formField1 = {
        id: 'foo',
      };

      formFieldRegistry.add(formField1);
      formFieldInstanceRegistry.add({
        id: formField1.id,
        expressionContextInfo: {},
        valuePath: ['foo'],
        indexes: {},
      });

      formField2 = {
        id: 'bar',
      };

      formFieldRegistry.add(formField2);
      formFieldInstanceRegistry.add({
        id: formField2.id,
        expressionContextInfo: {},
        valuePath: ['bar'],
        indexes: {},
      });
    }));

    it('should clear', inject(function (formFieldInstanceRegistry) {
      // when
      formFieldInstanceRegistry.clear();

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(0);
    }));

    it('should clear on form.clear', inject(function (eventBus, formFieldInstanceRegistry) {
      // when
      eventBus.fire('form.clear');

      // then
      expect(formFieldInstanceRegistry.getAll()).to.have.length(0);
    }));
  });
});
