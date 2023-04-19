import { render } from '@testing-library/preact/pure';

import EditorText from '../../../../../src/render/components/editor-form-fields/EditorText';

import { expectNoViolations, createFormContainer } from '../../../../TestHelper';

import { WithEditorFormContext } from './helper';

import { FeelersTemplating } from '@bpmn-io/form-js-viewer';

let container;


describe('Text', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render non-editor', function() {

    // when
    const { container } = createEditorText();

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-text')).to.be.true;

    expect(container.querySelector('h1')).to.exist;
    expect(container.querySelector('ul')).to.exist;
    expect(container.querySelector('li')).to.exist;
  });


  it('should disable links', function() {

    // given
    const { container } = createEditorText({
      field: {
        text: '# Text\n* Learn more about [forms](https://bpmn.io).',
        type: 'text'
      }
    });

    // then
    const formField = container.querySelector('.fjs-form-field');
    const link = formField.querySelector('a');

    expect(link).to.exist;
    expect(link.classList.contains('fjs-disabled-link')).to.be.true;
  });


  describe('placeholders', function() {

    it('should render expression placeholder', function() {

      // given
      const { container } = createEditorText({
        field: {
          text: '=foo',
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');
      const placeholder = formField.querySelector('.fjs-form-field-placeholder');
      expect(placeholder).to.exist;
      expect(placeholder.textContent).to.eql('Text view is populated by an expression');
    });


    it('should render empty placeholder', function() {

      // given
      const { container } = createEditorText({
        field: {
          text: '',
          type: 'text'
        }
      });

      // then
      const formField = container.querySelector('.fjs-form-field');
      const placeholder = formField.querySelector('.fjs-form-field-placeholder');
      expect(placeholder).to.exist;
      expect(placeholder.textContent).to.eql('Text view is empty');
    });

  });


  it('#create', function() {

    // assume
    const { config } = EditorText;
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


  describe('a11y', function() {

    it('should have no violations - default', async function() {

      // given
      this.timeout(5000);

      const { container } = createEditorText();

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - placeholder', async function() {

      // given
      this.timeout(5000);

      const { container } = createEditorText({
        field: {
          text: '=content',
          type: 'text'
        },
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

const defaultTemplateEvaluator = new FeelersTemplating();

function createEditorText(options = {}) {
  const {
    field = defaultField,
    isTemplate = defaultTemplateEvaluator.isTemplate,
    isExpression = (text) => text.startsWith('=')
  } = options;

  return render(WithEditorFormContext(
    <EditorText field={ field } />,
    {
      ...options,
      isTemplate,
      isExpression
    }
  ),
  {
    container: options.container || container.querySelector('.fjs-form')
  });
}