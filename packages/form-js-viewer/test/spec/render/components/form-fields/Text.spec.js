import { render } from '@testing-library/preact/pure';

import { Text } from '../../../../../src/render/components/form-fields/Text';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

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
    expect(formField.innerHTML).to.eql(`<h1>h1</h1>
<h2>h2</h2>
<h3>h3</h3>
<h4>h4</h4>
<h5>h5</h5>
<h6>h6</h6>
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
<pre><code>Some Code
</code></pre>
<p>Some <em>em</em> <strong>strong</strong> <a href="#text">text</a> <code>code</code>.</p>
<hr>
<p><img alt="Image" src="#"></p>
`);

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


  it('should render markdown link (overridden target)', function() {

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
    expect(formField.innerHTML).to.equal('');
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
    expect(formField.innerHTML).to.eql('<h1>foo</h1>\n');
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

    const expected = `<table>
<thead>
<tr>
<th>foo</th>
<th>bar</th>
</tr>
</thead>
<tbody><tr>
<td>baz</td>
<td>qux</td>
</tr>
</tbody></table>
`;

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
    expect(formField.innerHTML).to.eql('<h1>foo</h1>\n');
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
    expect(formField.innerHTML).to.eql('<p>["#foo", "###bar"]</p>\n');
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
      expect(formField.innerHTML).to.eql('<p>foo</p>\n');
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
      expect(formField.innerHTML).to.eql('<p>bar</p>\n');
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
      expect(formField.innerHTML).to.eql('<h1>bar</h1>\n');

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
      expect(formField.innerHTML).to.eql('<p>foo bar</p>\n');

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
      expect(formField.innerHTML).to.eql('<h1>bar foo</h1>\n');

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
      expect(formField.innerHTML).to.eql('<p>foo bar</p>\n');

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
      expect(formField.innerHTML).to.eql('<p>foo </p>\n');

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
      expect(formField.innerHTML).to.eql('<h1>foo bar</h1>\n');
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
      expect(formField.innerHTML).to.eql('<p>foo barbarbar</p>\n');
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
      expect(formField.innerHTML).to.eql('<h1>foo barbarbar</h1>\n');
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
      expect(formField.innerHTML).to.eql('<p>foo abc</p>\n');
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
      expect(formField.innerHTML).to.eql('<p>foo  {{⚠}} </p>\n');

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
        services: {
          templating: {
            isTemplate: () => true,
            evaluate: (template) => { return 'EVALUATED:' + template; }
          }
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');

      expect(formField).to.exist;
      expect(formField.innerHTML).to.eql('<p>EVALUATED:myTemplate</p>\n');
    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createText();

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - links', async function() {

      // given
      this.timeout(10000);

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
      this.timeout(10000);

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

function createText({ services, ...restOptions } = {}) {
  const options = {
    domId: 'test-text',
    field: defaultField,
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <Text
        domId={ options.domId }
        errors={ options.errors }
        field={ options.field } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}