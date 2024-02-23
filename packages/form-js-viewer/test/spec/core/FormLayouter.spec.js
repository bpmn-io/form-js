import {
  bootstrapForm,
  getForm,
  inject
} from 'test/TestHelper';

import schema from '../rows.json';


describe('FormLayouter', function() {

  beforeEach(bootstrapForm(schema));

  afterEach(function() {
    getForm().destroy();
  });


  describe('#clear', function() {

    it('should clear', inject(function(form, formLayouter) {

      // given
      const schema = form._getState().schema;

      // when
      formLayouter.clear();
      const rows = formLayouter.getRows(schema.id);

      expect(rows).to.eql([]);
    }));


    it('should emit event when layout cleared', inject(function(eventBus, formLayouter) {

      // given
      const spy = sinon.spy();

      eventBus.on('form.layoutCleared', spy);

      // when
      formLayouter.clear();

      // then
      expect(spy).to.have.been.calledOnce;
    }));

  });


  describe('#calculateLayout', function() {

    it('should calculate layout', inject(function(form, formLayouter) {

      // given
      const schema = form._getState().schema;
      formLayouter.clear();

      // when
      formLayouter.calculateLayout(schema);

      // then
      const rows = formLayouter.getRows(schema.id);

      expect(rows).to.eql([
        {
          rowId: 'Row_1',
          fieldIds: [ 'Textfield_1', 'Number_1' ]
        },
        {
          rowId: 'Row_2',
          fieldIds: [ 'Textfield_2', 'Checkbox_1' ]
        },
        {
          rowId: 'Row_3',
          fieldIds: [ 'Textarea_1' ]
        }
      ]);

    }));


    it('should emit event when layout calculated', inject(function(eventBus, form, formLayouter) {

      // given
      const spy = sinon.spy();

      eventBus.on('form.layoutCalculated', spy);

      const schema = form._getState().schema;
      formLayouter.clear();

      // when
      formLayouter.calculateLayout(schema);

      // then
      expect(spy).to.have.been.calledOnce;
    }));

  });


  it('#getRow', inject(function(formLayouter) {

    // when
    const row = formLayouter.getRow('Row_1');

    // then
    expect(row).to.eql({
      rowId: 'Row_1',
      fieldIds: [ 'Textfield_1', 'Number_1' ]
    });
  }));


  it('#getRowForField', inject(function(formLayouter, formFieldRegistry) {

    // given
    const field = formFieldRegistry.get('Textfield_1');

    // when
    const row = formLayouter.getRowForField(field);

    // then
    expect(row).to.eql({
      rowId: 'Row_1',
      fieldIds: [ 'Textfield_1', 'Number_1' ]
    });
  }));


  it('#nextRowId', inject(function(formLayouter) {

    // when
    const id = formLayouter.nextRowId();

    // then
    expect(id).to.exist;
  }));

});