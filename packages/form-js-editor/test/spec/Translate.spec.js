import { expect } from 'chai';
import { act } from '@testing-library/preact/pure';

import { OPTIONS_SOURCES, OPTIONS_SOURCES_LABELS } from '@bpmn-io/form-js-viewer';

import { createFormEditor } from '../../src';

import { collectTranslations } from '@bpmn-io/form-js-i18n/tasks/TranslationCollector.js';

import schema from './form.json';

// the fixtures below would otherwise end up in the collected keys
const suite = collectTranslations ? describe.skip : describe;

/**
 * Translations are enabled, not provided: the editor registers the default
 * `translate` and consumers override it at module configuration time, the same
 * way bpmn-js does.
 */

suite('translate', function () {
  let container, formEditor;

  const bootstrapFormEditor = (options) =>
    act(async () => {
      formEditor = await createFormEditor(options);
    });

  /**
   * @param {Record<string, string>} dictionary
   */
  const createTranslate =
    (dictionary) =>
    (template, replacements = {}) =>
      (dictionary[template] || template).replace(/{([^}]+)}/g, (_, key) => replacements[key] || '{' + key + '}');

  beforeEach(function () {
    container = document.createElement('div');

    container.style.height = '100%';

    document.body.appendChild(container);
  });

  afterEach(function () {
    document.body.removeChild(container);
    formEditor && formEditor.destroy();
    formEditor = null;
  });

  it('should render English by default', async function () {
    // when
    await bootstrapFormEditor({ container, schema });

    // then
    expect(container.querySelector('.fjs-palette-header').textContent).to.eql('Components');
  });

  it('should render a custom translation', async function () {
    // given
    const translate = createTranslate({
      Components: 'Komponenten',
      'Search components': 'Komponenten suchen',
    });

    // when
    await bootstrapFormEditor({
      container,
      schema,
      additionalModules: [{ translate: ['value', translate] }],
    });

    // then
    expect(container.querySelector('.fjs-palette-header').textContent).to.eql('Komponenten');
    expect(container.querySelector('.fjs-palette-search').getAttribute('placeholder')).to.eql('Komponenten suchen');
  });

  it('should render an English palette entry title by default', async function () {
    // when
    await bootstrapFormEditor({ container, schema });

    // then
    expect(container.querySelector('[data-field-type="textfield"]').getAttribute('title')).to.eql(
      'Create Text field element',
    );
  });

  it('should translate a palette entry title through a static key', async function () {
    // given
    const translate = createTranslate({
      'Create {label} element': '{label}-Element erstellen',
      'Text field': 'Textfeld',
    });

    // when
    await bootstrapFormEditor({
      container,
      schema,
      additionalModules: [{ translate: ['value', translate] }],
    });

    // then
    expect(container.querySelector('[data-field-type="textfield"]').getAttribute('title')).to.eql(
      'Textfeld-Element erstellen',
    );
  });

  it('should translate a palette entry text and title consistently', async function () {
    // given
    const translate = createTranslate({
      'Create {label} element': '{label} einfügen',
      'Text field': 'Textfeld',
    });

    // when
    await bootstrapFormEditor({
      container,
      schema,
      additionalModules: [{ translate: ['value', translate] }],
    });

    // then
    const entry = container.querySelector('[data-field-type="textfield"]');

    expect(entry.querySelector('.fjs-palette-field-text').textContent).to.eql('Textfeld');
    expect(entry.getAttribute('title')).to.eql('Textfeld einfügen');
  });
});
