import { expect } from 'chai';
import * as sinon from 'sinon';
import { render, fireEvent } from '@testing-library/preact/pure';

import { FormFields } from '@bpmn-io/form-js-viewer';

import { Palette, collectPaletteEntries, PALETTE_GROUPS } from '../../../../src/features/palette/components/Palette';

import { expectNoViolations, insertStyles } from '../../../TestHelper';

import { MockEditorContext } from '../../../helper';

insertStyles();

describe('palette', function () {
  let parent, container;

  /**
   * A dictionary based `translate` behaving like the default one: unknown
   * templates fall through, replacements are interpolated.
   *
   * @param {Record<string, string>} dictionary
   */
  const createTranslate =
    (dictionary) =>
    (template, replacements = {}) =>
      (dictionary[template] || template).replace(/{([^}]+)}/g, (_, key) => replacements[key] || '{' + key + '}');

  beforeEach(function () {
    parent = document.createElement('div');

    parent.classList.add('fjs-container', 'fjs-editor-container');

    container = document.createElement('div');

    container.classList.add('fjs-palette-container');

    container.style.position = 'absolute';
    container.style.left = '0';

    parent.appendChild(container);

    document.body.appendChild(parent);
  });

  afterEach(function () {
    document.body.removeChild(parent);
  });

  it('should render entries', async function () {
    // given
    const result = createPalette({ container });

    const paletteEntries = collectPaletteEntries(new FormFields());

    // then
    expect(result.container.querySelectorAll('.fjs-palette-field')).to.have.length(paletteEntries.length);

    expectEntries(result.container, paletteEntries);
  });

  it('should render groups', async function () {
    // given
    const result = createPalette({ container });

    // then
    expect(result.container.querySelectorAll('.fjs-palette-group')).to.have.length(PALETTE_GROUPS.length);

    expectGroups(result.container, PALETTE_GROUPS);
  });

  describe('search', function () {
    it('should render search', function () {
      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // then
      expect(search).to.exist;
    });

    it('should display matches (name)', function () {
      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text' } });

      // then
      expectEntries(result.container, [{ type: 'textfield' }, { type: 'textarea' }, { type: 'text' }]);
    });

    it('should ignore spaces in search', function () {
      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text field' } });

      // then
      expectEntries(result.container, [{ type: 'textfield' }]);
    });

    it('should report when nothing matches', function () {
      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'nonexistent' } });

      // then
      expect(result.container.querySelector('.fjs-palette-no-entries')).to.exist;
    });

    it('should match the untranslated type', function () {
      // given
      // a dictionary that (wrongly) covers the technical type must not break
      // searching by that type
      const translate = (template) => (template === 'textfield' ? 'Textfeld' : template);

      const result = createPalette({ container, services: { translate } });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'textfield' } });

      // then
      expectEntries(result.container, [{ type: 'textfield' }]);
    });
  });

  describe('clear', function () {
    it('should not display clear', async function () {
      // given
      const result = createPalette({ container });

      const clear = result.container.querySelector('.fjs-palette-search-clear');

      // then
      expect(clear).to.not.exist;
    });

    it('should display clear', async function () {
      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text' } });

      const clear = result.container.querySelector('.fjs-palette-search-clear');

      // then
      expect(clear).to.exist;
    });

    it('should clear', async function () {
      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      fireEvent.input(search, { target: { value: 'text' } });

      // assume
      expectEntries(result.container, [{ type: 'textfield' }, { type: 'textarea' }, { type: 'text' }]);

      const clear = result.container.querySelector('.fjs-palette-search-clear');

      // when
      fireEvent.click(clear);

      // then
      expectEntries(result.container, collectPaletteEntries(new FormFields()));
    });

    it('should render the English title by default', function () {
      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text' } });

      // then
      expect(result.container.querySelector('.fjs-palette-search-clear').getAttribute('title')).to.eql('Clear content');
    });

    it('should translate the title', function () {
      // given
      const translate = createTranslate({ 'Clear content': 'Inhalt loeschen' });

      const result = createPalette({ container, services: { translate } });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text' } });

      // then
      expect(result.container.querySelector('.fjs-palette-search-clear').getAttribute('title')).to.eql(
        'Inhalt loeschen',
      );
    });
  });

  describe('entry title', function () {
    it('should render English by default', function () {
      // given
      const result = createPalette({ container });

      // then
      expect(getEntryTitle(result.container, 'textfield')).to.eql('Create Text field element');
    });

    it('should translate through a static key', function () {
      // given
      // the dictionary is keyed by the static template, not by the composed sentence
      const translate = createTranslate({
        'Create {label} element': '{label}-Element erstellen',
        'Text field': 'Textfeld',
      });

      const result = createPalette({ container, services: { translate } });

      // then
      expect(getEntryTitle(result.container, 'textfield')).to.eql('Textfeld-Element erstellen');
    });

    it('should interpolate the label placeholder', function () {
      // given
      // the placeholder does not sit where English puts it
      const translate = createTranslate({
        'Create {label} element': 'Criar um elemento do tipo {label}',
        'Text field': 'Campo de texto',
      });

      const result = createPalette({ container, services: { translate } });

      // then
      expect(getEntryTitle(result.container, 'textfield')).to.eql('Criar um elemento do tipo Campo de texto');
    });

    it('should not look up the composed sentence', function () {
      // given
      // a dictionary keyed by the composed sentence must have no effect, proving
      // the key handed to `translate` is the static template
      const translate = createTranslate({
        'Create Text field element': 'Textfeld-Element erstellen',
      });

      const result = createPalette({ container, services: { translate } });

      // then
      expect(getEntryTitle(result.container, 'textfield')).to.eql('Create Text field element');
    });

    it('should not translate the technical type', function () {
      // given
      // a dictionary that (wrongly) covers the technical type must not leak into the title
      const translate = createTranslate({ textfield: 'Textfeld' });

      const result = createPalette({ container, services: { translate } });

      // then
      expect(getEntryTitle(result.container, 'textfield')).to.eql('Create Text field element');
    });
  });

  describe('keyboard support', function () {
    it('should add entry on ENTER', async function () {
      // given
      const spy = sinon.spy();

      const schema = {
        components: [],
      };

      const result = createPalette({
        container,
        services: {
          modeling: { addFormField: spy },
          formEditor: { _getState: () => ({ schema }) },
        },
      });

      const entry = result.container.querySelector('[data-field-type="textfield"]');

      // when
      fireEvent.focus(entry);
      fireEvent.keyDown(entry, { key: 'Enter', code: 'Enter' });

      // then
      expect(spy).to.have.been.calledOnceWith({ type: 'textfield' }, schema, 0);
    });

    it('should add entry to last position', async function () {
      // given
      const spy = sinon.spy();

      const schema = {
        components: [
          {
            type: 'textfield',
            id: 'foo',
          },
        ],
      };

      const result = createPalette({
        container,
        services: {
          modeling: { addFormField: spy },
          formEditor: { _getState: () => ({ schema }) },
        },
      });

      const entry = result.container.querySelector('[data-field-type="textfield"]');

      // when
      fireEvent.focus(entry);
      fireEvent.keyDown(entry, { key: 'Enter', code: 'Enter' });

      // then
      expect(spy).to.have.been.calledOnceWith({ type: 'textfield' }, schema, 1);
    });
  });

  describe('a11y', function () {
    it('should have no violations', async function () {
      // given
      this.timeout(10000);

      const result = createPalette({ container });

      // then
      await expectNoViolations(result.container);
    });

    it('should have no violations - searched', async function () {
      // given
      this.timeout(10000);

      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text' } });

      // then
      await expectNoViolations(result.container);
    });
  });

  describe('extension support', function () {
    it('should render custom entry from extension', function () {
      // given
      const extension = {
        config: {
          label: 'Custom',
          group: 'basic-input',
          iconUrl: 'foo-bar',
        },
      };

      const formFields = new FormFields();

      formFields.register('custom', extension);

      // given
      const result = createPalette({ container, services: { formFields } });

      const paletteEntries = collectPaletteEntries(formFields);

      // then
      expect(result.container.querySelectorAll('.fjs-palette-field')).to.have.length(paletteEntries.length);

      expectEntries(result.container, [...paletteEntries, { type: 'custom' }]);
    });

    it('should render custom entry icon from icon', function () {
      // given
      const extension = {
        config: {
          label: 'Custom',
          group: 'basic-input',
          icon: () => <div class="custom-icon"></div>,
        },
      };

      const formFields = new FormFields();

      formFields.register('custom', extension);

      // given
      const result = createPalette({ container, services: { formFields } });

      // then
      expect(result.container.querySelector('.custom-icon')).to.exist;
    });

    it('should render custom entry icon from iconUrl', function () {
      // given
      const extension = {
        config: {
          label: 'Custom',
          group: 'basic-input',
          iconUrl: 'https://foo.bar/baz.png',
        },
      };

      const formFields = new FormFields();

      formFields.register('custom', extension);

      // given
      const result = createPalette({ container, services: { formFields } });

      const iconImage = result.container.querySelector('.fjs-field-icon-image');

      // then
      expect(iconImage).to.exist;
      expect(iconImage.src).to.eql(extension.config.iconUrl);
    });
  });
});

// helper ///////////////

function createPalette({ services, container, ...restOptions } = {}) {
  return render(
    <MockEditorContext options={restOptions} services={services}>
      <Palette />
    </MockEditorContext>,
    {
      container,
    },
  );
}

function expectEntries(container, fieldTypes) {
  fieldTypes.forEach(({ type }) => {
    expect(container.querySelector(`[data-field-type="${type}"]`)).to.exist;
  });
}

function getEntryTitle(container, type) {
  return container.querySelector(`[data-field-type="${type}"]`).getAttribute('title');
}

function expectGroups(container, groups) {
  groups.forEach(({ id }) => {
    expect(container.querySelector(`[data-group-id="${id}"]`)).to.exist;
  });
}
