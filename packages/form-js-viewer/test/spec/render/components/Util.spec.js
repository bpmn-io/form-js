import {
  formFieldClasses
} from '../../../../src/render/components/Util';


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
      const classes = formFieldClasses('button', { errors:[ 'foo' ] });

      // then
      expect(classes).to.equal('fjs-form-field fjs-form-field-button fjs-has-errors');
    });


    it('should contain disabled class', function() {

      // when
      const classes = formFieldClasses('button', { disabled: true });

      // then
      expect(classes).to.equal('fjs-form-field fjs-form-field-button fjs-disabled');
    });

  });

});