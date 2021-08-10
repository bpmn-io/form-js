import { textToLabel } from 'src/render/components/properties-panel/Util';


describe('properties panel util', function() {

  describe('#textToLabel', function() {

    it('should shorten text', function() {

      // when
      const label = textToLabel('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.');

      // then
      expect(label).to.equal('Lorem ipsum dolor sit amet, co...');
    });


    it('should default to ...', function() {

      // when
      const label = textToLabel();

      // then
      expect(label).to.equal('...');
    });

  });

});