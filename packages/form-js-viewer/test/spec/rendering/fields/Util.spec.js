import { formFieldClasses } from '../../../../src/rendering/fields/Util';


describe('Util', function() {

  describe('#formFieldClasses', function() {

    it('should contain type class', function() {

      // when
      const classes = formFieldClasses('button');

      // then
      expect(classes).to.equal('fjs-form-field fjs-form-field-button');
    });


    it('should contain errors class', function() {

      // when
      const classes = formFieldClasses('button', [ 'foo' ]);

      // then
      expect(classes).to.equal('fjs-form-field fjs-form-field-button fjs-has-errors');
    });

  });

});