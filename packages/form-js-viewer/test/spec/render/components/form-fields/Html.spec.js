import { render } from '@testing-library/preact/pure';

import { Html } from '../../../../../src/render/components/form-fields/Html';

import {
  createFormContainer,
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

let container;

describe('Html', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createHtmlComponent();

    // then
    const formField = container.querySelector('.fjs-form-field');
    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql(defaultField.content);
  });


  it('should render HTML content with inline styles', function() {

    // given
    const content = '<div style="font-size: 20px; color: blue;"><p>Some styled content</p></div>';

    // when
    const { container } = createHtmlComponent({
      field: { ...defaultField, content }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');
    expect(formField).to.exist;
    expect(formField.innerHTML).to.eql(content);
  });


  it('should allow style tags and apply styles', function() {

    // given
    const content = `
      <style>
        .test-style { color: red; }
      </style>
      <div class="test-style">Content with class style</div>
    `;

    // when
    const { container } = createHtmlComponent({
      field: { ...defaultField, content }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');
    expect(formField).to.exist;
    expect(formField.innerHTML).to.include('Content with class style');

    const styledDiv = formField.querySelector('.test-style');
    expect(styledDiv).to.exist;

    const computedStyle = window.getComputedStyle(styledDiv);
    expect(computedStyle.color).to.equal('rgb(255, 0, 0)');
  });


  it('should not render Markdown', function() {

    // given
    const markdownContent = '# Heading\n* Bullet Point';

    // when
    const { container } = createHtmlComponent({
      field: { ...defaultField, content: markdownContent }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');
    expect(formField).to.exist;
    expect(formField.innerHTML).not.to.include('<h1>Heading</h1>');
    expect(formField.innerHTML).not.to.include('<ul><li>Bullet Point</li></ul>');
  });


  it('should render template insert inside the output', function() {

    // given
    const content = 'foo <span>{{foo2}}</span>';
    const initialData = {
      foo2: 'bar'
    };

    // when
    const { container } = createHtmlComponent({
      initialData,
      field: {
        ...defaultField,
        content
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');
    expect(formField).to.exist;

    expect(formField.innerHTML).to.eql('foo <span>bar</span>');
  });


  it('should escape any html injected into template inserts', function() {

    // given
    const content = 'foo <span>{{foo2}}</span>';
    const initialData = {
      foo2: '<script>alert("foo")</script>'
    };

    // when
    const { container } = createHtmlComponent({
      initialData,
      field: {
        ...defaultField,
        content
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');
    expect(formField).to.exist;

    expect(formField.innerHTML).to.eql('foo <span>&lt;script&gt;alert("foo")&lt;/script&gt;</span>');
  });

});

// helpers //////////

const defaultField = {
  content: '<p>Hello World</p>',
  type: 'html'
};

function createHtmlComponent({ services, ...restOptions } = {}) {
  const options = {
    domId: 'test-html-component',
    field: defaultField,
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <Html
        domId={ options.domId }
        errors={ options.errors }
        field={ options.field } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}
