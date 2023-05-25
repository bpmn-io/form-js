import { render } from '@testing-library/preact/pure';

import Text from '../../../../../src/render/components/form-fields/Text';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

let container;


describe('Text', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createText();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-text')).to.be.true;

    expect(container.querySelector('h1')).to.exist;
    expect(container.querySelector('ul')).to.exist;
    expect(container.querySelector('li')).to.exist;
  });


  it('should render markdown', function() {

    // given
    const text = `
# h1
## h2
### h3
#### h4
##### h5
###### h6

> Blockquote

* ul li 1
* ul li 2

1. ol li 1
2. ol li 2

\`\`\`
Some Code
\`\`\`

Some _em_ **strong** [text](#text) \`code\`.

---

![Image](#)
  `.trim();

    // when
    const { container } = createText({
      field: {
        text,
        type: 'Text'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql(`<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1 id="h1">h1</h1>
<h2 id="h2">h2</h2>
<h3 id="h3">h3</h3>
<h4 id="h4">h4</h4>
<h5 id="h5">h5</h5>
<h6 id="h6">h6</h6>
<blockquote>
  <p>Blockquote</p>
</blockquote>
<ul>
<li>ul li 1</li>
<li>ul li 2</li>
</ul>
<ol>
<li>ol li 1</li>
<li>ol li 2</li>
</ol>
<pre><code>Some Code</code></pre>
<p>Some <em>em</em> <strong>strong</strong> <a href="#text">text</a> <code>code</code>.</p>
<hr>
<p><img alt="Image" src="#"></p></div></div>`);

  });


  it('should render markdown link', function() {

    // given
    const text = '[forms](https://bpmn.io/)';

    // when
    const { container } = createText({
      field: {
        text,
        type: 'Text'
      }
    });

    // then

    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;

    const link = formField.querySelector('a');

    expect(link).to.exist;
    expect(link.href).to.eql('https://bpmn.io/');
    expect(link.target).to.eql('');
  });


  it('should render markdown link (overriden target)', function() {

    // given
    const text = '[forms](https://bpmn.io/)';

    // when
    const { container } = createText({
      field: {
        text,
        type: 'Text'
      },
      properties: {
        textLinkTarget: '_blank'
      }
    });

    // then

    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;

    const link = formField.querySelector('a');

    expect(link).to.exist;
    expect(link.href).to.eql('https://bpmn.io/');
    expect(link.target).to.eql('_blank');
  });


  it('should render (no text)', function() {

    // when
    const { container } = createText({
      field: {
        type: 'text'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-text')).to.be.true;
    expect(formField.innerHTML).to.equal('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"></div></div>');
  });


  it('should render markdown (expression)', function() {

    // given
    const { container } = createText({
      initialData: {
        foo: '# foo'
      },
      field: {
        text: '=foo',
        type: 'text'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1 id="foo">foo</h1></div></div>');
  });


  it('should render markdown (table)', function() {

    // given
    const { container } = createText({
      field: {
        text: '| foo | bar |\n| --- | --- |\n| baz | qux |',
        type: 'text'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    const expected = `<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><table>
<thead>
<tr>
<th id="foo">foo</th>
<th id="bar">bar</th>
</tr>
</thead>
<tbody>
<tr>
<td>baz</td>
<td>qux</td>
</tr>
</tbody>
</table></div></div>`;

    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql(expected);
  });


  // TODO: implement mocking renderer
  it.skip('should allow overriding rendering module', function() {

    // given
    const content = '# foo';

    const { container } = createText({
      initialData: {
        foo: '#foo'
      },
      field: {
        text: '=foo0',
        type: 'text'
      },
      evaluateExpression: () => content,
      isExpression: () => true
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1>foo</h1></div></div>');
  });


  it('should render markdown (complex expression)', function() {

    const { container } = createText({
      initialData: {
        content: [ '#foo', '###bar' ]
      },
      field: {
        text: '=content',
        type: 'text'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>#foo,###bar</p></div></div>');
  });


  it('#create', function() {

    // assume
    const { config } = Text;
    expect(config.type).to.eql('text');
    expect(config.label).to.eql('Text view');
    expect(config.group).to.eql('presentation');
    expect(config.keyed).to.be.false;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({
      text: '# Text'
    });

    // but when
    const customField = config.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  describe('templating', function() {

    it('should not affect simple string', function() {

      // given
      const text = 'foo';

      // when
      const { container } = createText({
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>foo</p></div></div>');
    });


    it('should render pure feel', function() {

      // given
      const text = '=foo';

      // when
      const { container } = createText({
        initialData: {
          foo: 'bar'
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>bar</p></div></div>');
    });


    it('should render pure feel with markdown', function() {

      // given
      const text = '=foo';

      // when
      const { container } = createText({
        initialData: {
          foo: '# bar'
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1 id="bar">bar</h1></div></div>');

    });


    it('should render template insert', function() {

      // given
      const text = 'foo {{foo2}}';

      // when
      const { container } = createText({
        initialData: {
          foo2: 'bar'
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>foo bar</p></div></div>');

    });


    it('should render template insert with markdown', function() {

      // given
      const text = '{{foo2}} foo';

      // when
      const { container } = createText({
        initialData: {
          foo2: '# bar'
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1 id="bar-foo">bar foo</h1></div></div>');

    });


    it('should render template condition if true', function() {

      // given
      const text = 'foo {{#if condition}}bar{{/if}}';

      // when
      const { container } = createText({
        initialData: {
          condition: true
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>foo bar</p></div></div>');

    });


    it('should not render template condition if false', function() {

      // given
      const text = 'foo {{#if condition}}bar{{/if}}';

      // when
      const { container } = createText({
        initialData: {
          condition: false
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>foo </p></div></div>');

    });


    it('should render template condition with markdown', function() {

      // given
      const text = '# foo {{#if condition}}bar{{/if}}';

      // when
      const { container } = createText({
        initialData: {
          condition: true
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1 id="foo-bar">foo bar</h1></div></div>');
    });


    it('should render template loop', function() {

      // given
      const text = 'foo {{#loop items}}bar{{/loop}}';

      // when
      const { container } = createText({
        initialData: {
          items: [ 'a', 'b', 'c' ]
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>foo barbarbar</p></div></div>');
    });


    it('should render template loop with markdown', function() {

      // given
      const text = '# foo {{#loop items}}bar{{/loop}}';

      // when
      const { container } = createText({
        initialData: {
          items: [ 'a', 'b', 'c' ]
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1 id="foo-barbarbar">foo barbarbar</h1></div></div>');
    });


    it('should render template loop with insert', function() {

      // given
      const text = 'foo {{#loop items}}{{this}}{{/loop}}';

      // when
      const { container } = createText({
        initialData: {
          items: [ 'a', 'b', 'c' ]
        },
        field: {
          text,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>foo abc</p></div></div>');
    });


    it('should enforce strict mode', function() {

      // given
      const text = 'foo {{#if condition}}bar{{/if}}';

      // when
      const { container } = createText({
        text,
        initialData: {
          condition: 'notABoolean'
        },
        field: {
          text: 'foo {{#if condition}}bar{{/if}}',
          strict: true,
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>foo  {{⚠}} </p></div></div>');

    });


    it('should allow template module override', function() {

      // given
      const text = 'myTemplate';

      // when
      const { container } = createText({
        field: {
          text,
          type: 'text'
        },
        isTemplate: () => true,
        evaluateTemplate: (template) => { return 'EVALUATED:' + template; }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><p>EVALUATED:myTemplate</p></div></div>');
    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const { container } = createText();

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - links', async function() {

      // given
      this.timeout(5000);

      const { container } = createText({
        field: {
          text: '# Text\n* Learn more about [forms](https://bpmn.io).',
          type: 'text'
        }
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - expression', async function() {

      // given
      this.timeout(5000);

      const content = '# foo';

      const { container } = createText({
        initialData: {
          content
        },
        field: {
          text: '=content',
          type: 'text'
        },
        isExpression: () => true,
        evaluateExpression: () => content
      });

      // then
      await expectNoViolations(container);
    });

  });

});

// helpers //////////

const defaultField = {
  text: '# Text\n* Hello World',
  type: 'text'
};

function createText(options = {}) {
  const {
    errors,
    data = {},
    initialData = {},
    field = defaultField,
    properties = {},
    onChange
  } = options;

  return render(WithFormContext(
    <Text
      errors={ errors }
      field={ field }
      onChange={ onChange } />,
    {
      ...options,
      properties,
      initialData,
      data
    }
  ),
  {
    container: options.container || container.querySelector('.fjs-form')
  });
}