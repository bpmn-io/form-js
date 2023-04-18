import {
  bootstrapFormEditor,
  inject
} from '../../TestHelper';

import schema from './FormLayoutValidator.form.json';


describe('core/FormLayoutValidator', function() {

  beforeEach(bootstrapFormEditor(schema));


  describe('#validateField', function() {

    it('should disallow - min', inject(function(formLayoutValidator, formFieldRegistry) {

      // given
      const field = formFieldRegistry.get('Textfield_1');

      // when
      const error = formLayoutValidator.validateField(field, 1);

      // then
      expect(error).to.eql('Minimum 2 columns are allowed');
    }));


    it('should disallow - max', inject(function(formLayoutValidator, formFieldRegistry) {

      // given
      const field = formFieldRegistry.get('Textfield_1');

      // when
      const error = formLayoutValidator.validateField(field, 20);

      // then
      expect(error).to.eql('Maximum 16 columns are allowed');
    }));


    it('should allow - uneven', inject(function(formLayoutValidator, formFieldRegistry) {

      // given
      const field = formFieldRegistry.get('Textfield_1');

      // when
      const error = formLayoutValidator.validateField(field, 3);

      // then
      expect(error).to.not.exist;
    }));


    it('should disallow - more than 16 columns per row', inject(
      function(formLayoutValidator, formFieldRegistry) {

        // given
        const field = formFieldRegistry.get('Textfield_1');

        // when
        const error = formLayoutValidator.validateField(field, 16);

        // then
        expect(error).to.eql('New value exceeds the maximum of 16 columns per row');
      }
    ));


    it('should disallow - 16 columns but another field', inject(
      function(formLayoutValidator, formFieldRegistry, formLayouter) {

        // given
        const field = formFieldRegistry.get('Datetime_1');

        const row = formLayouter.getRow('Row_2');

        // when
        const error = formLayoutValidator.validateField(field, field.layout.columns, row);

        // then
        expect(error).to.eql('New value exceeds the maximum of 16 columns per row');
      }
    ));


    it('should disallow - more than 4 fields per row', inject(
      async function(formLayoutValidator, formFieldRegistry, formLayouter) {

        // given
        const textfield = formFieldRegistry.get('Textfield_2');

        const row = formLayouter.getRow('Row_1');

        // when
        const error = formLayoutValidator.validateField(textfield, 4, row);

        // then
        expect(error).to.eql('Maximum 4 fields per row are allowed');
      }
    ));


    it('should disallow - auto columns', inject(
      function(formLayoutValidator, formFieldRegistry, formLayouter) {

        // given
        const field = formFieldRegistry.get('AutoTextfield_1');

        const row = formLayouter.getRow('Row_4');

        // when
        // explanation: two fields with auto columns, 12 columns left
        const error = formLayoutValidator.validateField(field, 13, row);

        // then
        expect(error).to.eql('New value exceeds the maximum of 16 columns per row');
      }
    ));

  });

});