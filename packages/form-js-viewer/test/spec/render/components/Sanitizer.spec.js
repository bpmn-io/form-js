import {
  sanitizeHTML,
  sanitizeImageSource
} from '../../../../src/render/components/Sanitizer';


describe('Sanitizer', function() {

  describe('#sanitizeHTML', function() {

    it('should sanitize HTML', function() {

      // given
      const html = '<script>alert("foo")</script>';

      // when
      const sanitized = sanitizeHTML(html);

      // then
      expect(sanitized).to.equal('<div xmlns="http://www.w3.org/1999/xhtml"></div>');
    });


    it('should sanitize HTML with attributes', function() {

      // given
      const html = '<script type="text/javascript">alert("foo")</script><h1>test</h1>';

      // when
      const sanitized = sanitizeHTML(html);

      // then
      expect(sanitized).to.equal('<div xmlns="http://www.w3.org/1999/xhtml"><h1>test</h1></div>');
    });


    it('should not clear safe HTML', function() {

      // given
      const html = '<p>foo</p>';

      // when
      const sanitized = sanitizeHTML(html);

      // then
      expect(sanitized).to.equal('<div xmlns="http://www.w3.org/1999/xhtml"><p>foo</p></div>');
    });

  });


  describe('#sanitizeImageSource', function() {

    it('should sanitize image source', function() {

      // given
      const src = 'javascript:alert(\'foo\')';

      // when
      const sanitized = sanitizeImageSource(src);

      // then
      expect(sanitized).to.equal('');
    });

  });

});