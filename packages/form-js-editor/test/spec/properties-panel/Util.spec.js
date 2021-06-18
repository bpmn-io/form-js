import { textToLabel } from 'src/render/components/properties-panel/Util';


describe('properties panel util', function() {

  describe('#textToLabel', function() {

    it('should shorten text', function() {

      // when
      const label = textToLabel('Lorem ipsum dolor sit amet');

      // then
      expect(label).to.equal('Lorem ipsu...');
    });


    it('should default to ...', function() {

      // when
      const label = textToLabel();

      // then
      expect(label).to.equal('...');
    });

  });

});