import {
  bootstrapFormEditor,
  inject
} from '../../TestHelper';


describe('core/FieldFactory', function() {

  const schema = {
    type: 'default'
  };

  beforeEach(bootstrapFormEditor(schema));


  describe('#create', function() {

    it('Button', testCreate({
      type: 'button',
      label: 'Button',
      keyed: true,
      defaults: {
        action: 'submit'
      }
    }));


    it('Checkbox', testCreate({
      type: 'checkbox',
      label: 'Checkbox',
      keyed: true
    }));


    it('Default', testCreate({
      type: 'default',
      keyed: false,
      defaults: {
        components: []
      }
    }));


    it('Number', testCreate({
      type: 'number',
      label: 'Number',
      keyed: true
    }));


    it('Radio', testCreate({
      type: 'radio',
      label: 'Radio',
      keyed: true,
      defaults: {
        values: [
          {
            label: 'Value',
            value: 'value'
          }
        ]
      }
    }));


    it('Select', testCreate({
      type: 'select',
      label: 'Select',
      keyed: true,
      defaults: {
        values: [
          {
            label: 'Value',
            value: 'value'
          }
        ]
      }
    }));


    it('Text Field', testCreate({
      type: 'textfield',
      label: 'Text Field',
      keyed: true
    }));

  });


  describe('#create (no defaults)', function() {

    it('Button', testCreate({
      type: 'button',
      defaults: {
        action: 'submit'
      }
    }, false));

  });

});


// helpers //////////////

function testCreate(options, applyDefaults=true) {

  const {
    type,
    label,
    keyed = false,
    defaults = {}
  } = options;

  return inject(function(fieldFactory) {

    // when
    const field = fieldFactory.create({ type }, applyDefaults);

    // then
    expect(field.id).to.exist;

    expect(field.type).to.eql(type);

    if (keyed) {
      expect(field.key).to.exist;
    } else {
      expect(field.key).not.to.exist;
    }

    if (label) {
      expect(field.label).to.eql(label);
    } else {
      expect(field.label).not.to.exist;
    }

    expect(field).to.deep.contain(defaults);
  });

}