import {
  formFieldClasses,
  safeMarkdown
} from '../../../../src/rendering/fields/Util';


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


  describe('safeMarkdown', function() {

    it('should remove disallowed tags', function() {

      // given
      const markdown = '#Foo<script>alert(\'foo\');</script>';

      // when
      const html = safeMarkdown(markdown);

      // then
      expect(html).to.equal('<div xmlns="http://www.w3.org/1999/xhtml"><h1>Foo</h1></div>');
    });


    it('should remove disallowed attributes', function() {

      // given
      const markdown = '<h1 onclick="alert(\'foo\');">Foo</h1>';

      // when
      const html = safeMarkdown(markdown);

      // then
      expect(html).to.equal('<div xmlns="http://www.w3.org/1999/xhtml"><h1>Foo</h1></div>');
    });


    it('should remove malicious href attributes', function() {

      // given
      const markdown = '<a href="javascript:throw onerror=alert,\'some string\',123,\'haha\'">Foo</a>';

      // when
      const html = safeMarkdown(markdown);

      // then
      expect(html).to.equal('<div xmlns="http://www.w3.org/1999/xhtml"><a>Foo</a></div>');
    });

  });

});