import { render } from '@testing-library/preact/pure';

import Text from '../../../../../src/render/components/form-fields/Text';

import { createFormContainer } from '../../../../TestHelper';

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
    expect(formField.innerHTML).to.eql(`<div class="markup"><div xmlns="http://www.w3.org/1999/xhtml"><h1>h1</h1><h2>h2</h2><h3>h3</h3><h4>h4</h4>

<blockquote>Blockquote</blockquote>

<ul><li>ul li 1</li><li>ul li 2</li></ul>

<ol><li>ol li 1</li><li>ol li 2</li></ol>

<p></p><pre class="code"><code>Some Code</code></pre><p></p>

<p>Some <em>em</em> <strong>strong</strong> <a href="#text">text</a> <code>code</code>.</p>

<p>---</p>

<p><img alt="Image" src="#"></p></div></div>
      `.trim()
    );

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

    const paragraph = container.querySelector('p');

    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.equal('');
  });


  it('#create', function() {

    // assume
    expect(Text.type).to.eql('text');
    expect(Text.label).not.to.exist;
    expect(Text.keyed).to.be.false;

    // when
    const field = Text.create();

    // then
    expect(field).to.eql({
      text: '# Text'
    });

    // but when
    const customField = Text.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
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
    disabled,
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ],
    value
  } = options;

  return render(
    <Text
      disabled={ disabled }
      errors={ errors }
      field={ field }
      onChange={ onChange }
      path={ path }
      value={ value } />,
    {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}