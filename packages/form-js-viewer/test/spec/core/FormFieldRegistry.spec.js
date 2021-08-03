import {
  bootstrapForm,
  getForm,
  inject
} from 'test/TestHelper';


describe('FormFieldRegistry', function() {

  beforeEach(bootstrapForm());

  afterEach(function() {
    getForm().destroy();
  });


  describe('#add', function() {

    it('should add form field', inject(function(formFieldRegistry) {

      // given
      const formField = {
        id: 'foo'
      };

      // when
      formFieldRegistry.add(formField);

      // then
      expect(formFieldRegistry.get('foo')).to.equal(formField);
      expect(formFieldRegistry.getAll()).to.have.length(1);
    }));


    it('should throw error if form field with ID already exists', inject(function(formFieldRegistry) {

      // given
      const formField = {
        id: 'foo'
      };

      formFieldRegistry.add(formField);

      // when
      // then
      expect(() => formFieldRegistry.add(formField)).to.throw('form field with ID foo already exists');
    }));


    it('should emit event when form field is added', inject(function(eventBus, formFieldRegistry) {

      // given
      const addSpy = sinon.spy();

      eventBus.on('formField.add', addSpy);

      const formField = {
        id: 'foo'
      };

      // when
      formFieldRegistry.add(formField);

      // then
      expect(addSpy).to.have.been.calledOnce;
      expect(addSpy).to.have.been.calledWithMatch({ formField });
    }));

  });


  describe('#add', function() {

    let formField;

    beforeEach(inject(function(formFieldRegistry) {
      formField = {
        id: 'foo'
      };

      formFieldRegistry.add(formField);
    }));


    it('should add form field', inject(function(formFieldRegistry) {

      // when
      formFieldRegistry.remove(formField);

      // then
      expect(formFieldRegistry.get('foo')).not.to.exist;
      expect(formFieldRegistry.getAll()).to.have.length(0);
    }));


    it('should emit event when form field is removed', inject(function(eventBus, formFieldRegistry) {

      // given
      const removeSpy = sinon.spy();

      eventBus.on('formField.remove', removeSpy);

      // when
      formFieldRegistry.remove(formField);

      // then
      expect(removeSpy).to.have.been.calledOnce;
      expect(removeSpy).to.have.been.calledWithMatch({ formField });
    }));

  });


  describe('#get', function() {

    let formField;

    beforeEach(inject(function(formFieldRegistry) {
      formField = {
        id: 'foo'
      };

      formFieldRegistry.add(formField);
    }));


    it('should get form field', inject(function(formFieldRegistry) {

      // when
      // then
      expect(formFieldRegistry.get('foo')).to.equal(formField);
    }));

  });


  describe('#get', function() {

    let formField1,
        formField2;

    beforeEach(inject(function(formFieldRegistry) {
      formField1 = {
        id: 'foo'
      };

      formFieldRegistry.add(formField1);

      formField2 = {
        id: 'bar'
      };

      formFieldRegistry.add(formField2);
    }));


    it('should get all form fields', inject(function(formFieldRegistry) {

      // when
      const formFields = formFieldRegistry.getAll();

      // then
      expect(formFields).to.have.length(2);
      expect(formFields).to.eql([ formField1, formField2 ]);
    }));

  });


  describe('#forEach', function() {

    let formField1,
        formField2;

    beforeEach(inject(function(formFieldRegistry) {
      formField1 = {
        id: 'foo'
      };

      formFieldRegistry.add(formField1);

      formField2 = {
        id: 'bar'
      };

      formFieldRegistry.add(formField2);
    }));


    it('should execute callback for all form fields', inject(function(formFieldRegistry) {

      // given
      const forEachSpy = sinon.spy();

      // when
      formFieldRegistry.forEach(forEachSpy);

      // then
      expect(forEachSpy).to.have.been.calledTwice;
      expect(forEachSpy.firstCall.args).to.eql([ formField1 ]);
      expect(forEachSpy.secondCall.args).to.eql([ formField2 ]);
    }));

  });


  describe('#clear', function() {

    let formField1,
        formField2;

    beforeEach(inject(function(formFieldRegistry) {
      formField1 = {
        id: 'foo'
      };

      formFieldRegistry.add(formField1);

      formField2 = {
        id: 'bar'
      };

      formFieldRegistry.add(formField2);
    }));


    it('should clear', inject(function(formFieldRegistry) {

      // when
      formFieldRegistry.clear();

      // then
      expect(formFieldRegistry.getAll()).to.have.length(0);
    }));


    it('should clear on form.clear', inject(function(eventBus, formFieldRegistry) {

      // when
      eventBus.fire('form.clear');

      // then
      expect(formFieldRegistry.getAll()).to.have.length(0);
    }));

  });

});