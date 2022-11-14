import { textToLabel } from '../../../../src/features/properties-panel/Util';


describe('properties panel util', function() {

  describe('#textToLabel', function() {

    it('should use the first text line as label', function() {

      // when
      const label = textToLabel('Lorem ipsum dolor sit amet\nConsetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.');

      // then
      expect(label).to.equal('Lorem ipsum dolor sit amet');

    });


    it('should ignore empty lines', function() {

      // when
      const label = textToLabel('\n\n\nLorem ipsum dolor sit amet\nConsetetur sadipscing elitr');

      // then
      expect(label).to.equal('Lorem ipsum dolor sit amet');

    });


    it('should ignore whitespace lines', function() {

      // when
      const label = textToLabel('\n   \n   \nLorem ipsum dolor sit amet\nConsetetur sadipscing elitr');

      // then
      expect(label).to.equal('Lorem ipsum dolor sit amet');

    });


    it('should tolerate empty string', function() {

      // when
      const label = textToLabel('');

      // then
      expect(label).to.equal(null);

    });


    it('should tolerate null', function() {

      // when
      const label = textToLabel(null);

      // then
      expect(label).to.equal(null);

    });

  });

});