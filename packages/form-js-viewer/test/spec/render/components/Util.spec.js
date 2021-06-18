import {
  formFieldClasses,
  markdownToHTML,
  safeMarkdown
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
      const classes = formFieldClasses('button', [ 'foo' ]);

      // then
      expect(classes).to.equal('fjs-form-field fjs-form-field-button fjs-has-errors');
    });

  });


  describe('markdownToHTML', function() {

    it('should generate paragraphs', function() {

      // given
      const markdown = `
# H1

__Lorem ipsum dolor__ first.

Second.
Second continued.

## H2

Third.

1.  List
    List continued.
2.  Second List

*   Unordered List
    Unordered list continued
*   Second Unordered List Item

![some small image](https://via.placeholder.com/400x150)
![ſome big image](https://via.placeholder.com/1000x150)
      `.trim();

      const expectedHTML = `
<h1>H1</h1>

<p><strong>Lorem ipsum dolor</strong> first.</p>

<p>Second.
Second continued.</p>

<h2>H2</h2>

<p>Third.</p>

<p><ol><li>List</li></ol><pre class="code poetry"><code>List continued.</code></pre><ol><li>Second List</li></ol></p>

<ul><li>Unordered List</li></ul><pre class="code poetry"><code>Unordered list continued</code></pre><ul><li>Second Unordered List Item</li></ul>

<p><img src="https://via.placeholder.com/400x150" alt="some small image">
<img src="https://via.placeholder.com/1000x150" alt="ſome big image"></p>
      `.trim();

      // when
      const html = markdownToHTML(markdown);

      // then
      expect(html).to.eql(expectedHTML);
    });


    it('should not paragraph-wrap heading', function() {

      // given
      const markdown = '#Foo<span>HELLO</span>';

      // when
      const html = markdownToHTML(markdown);

      // then
      expect(html).to.equal('<h1>Foo<span>HELLO</span></h1>');
    });


    it('should not paragraph-wrap HTML markup', function() {

      // given
      const markdown = '<h1>HELLO</h1>';

      // when
      const html = markdownToHTML(markdown);

      // then
      expect(html).to.equal('<h1>HELLO</h1>');
    });


    it('should create link', function() {

      // given
      const markdown = 'at [varius](http://foo) turpis nunc eget.';

      // when
      const html = markdownToHTML(markdown);

      // then
      expect(html).to.equal('<p>at <a href="http://foo">varius</a> turpis nunc eget.</p>');
    });


    it('should create heading + paragraph', function() {

      // given
      const markdown = `
# H1

Do [this](http://localhost), not __that__.
      `.trim();

      const expectedHTML = `
<h1>H1</h1>

<p>Do <a href="http://localhost">this</a>, not <strong>that</strong>.</p>
      `.trim();

      // when
      const html = markdownToHTML(markdown);

      // then
      expect(html).to.eql(expectedHTML);
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