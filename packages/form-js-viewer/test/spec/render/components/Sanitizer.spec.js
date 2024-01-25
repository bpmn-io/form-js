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
      expect(sanitized).to.equal('');
    });


    it('should sanitize HTML with attributes', function() {

      // given
      const html = '<script type="text/javascript">alert("foo")</script><h1>test</h1>';

      // when
      const sanitized = sanitizeHTML(html);

      // then
      expect(sanitized).to.equal('<h1>test</h1>');
    });


    it('should not clear safe HTML', function() {

      // given
      const html = '<p>foo</p>';

      // when
      const sanitized = sanitizeHTML(html);

      // then
      expect(sanitized).to.equal('<p>foo</p>');
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