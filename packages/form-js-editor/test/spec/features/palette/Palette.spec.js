import { render, fireEvent } from '@testing-library/preact/pure';

import Palette, {
  PALETTE_ENTRIES,
  PALETTE_GROUPS
} from '../../../../src/features/palette/components/Palette';

import { expectNoViolations, insertStyles } from '../../../TestHelper';

import { WithFormEditorContext } from '../properties-panel/helper';

insertStyles();

describe('palette', function() {

  let parent,
      container;

  beforeEach(function() {
    parent = document.createElement('div');

    parent.classList.add('fjs-container', 'fjs-editor-container');

    container = document.createElement('div');

    container.classList.add('fjs-palette-container');

    container.style.position = 'absolute';
    container.style.left = '0';

    parent.appendChild(container);

    document.body.appendChild(parent);
  });

  afterEach(function() {
    document.body.removeChild(parent);
  });


  it('should render entries', async function() {

    // given
    const result = createPalette({ container });

    // then
    expect(result.container.querySelectorAll('.fjs-palette-field')).to.have.length(12);

    expectEntries(result.container, PALETTE_ENTRIES);
  });


  it('should render groups', async function() {

    // given
    const result = createPalette({ container });

    // then
    expect(result.container.querySelectorAll('.fjs-palette-group')).to.have.length(4);

    expectGroups(result.container, PALETTE_GROUPS);
  });


  describe('search', function() {

    it('should render search', function() {

      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // then
      expect(search).to.exist;
    });


    it('should display matches (name)', function() {

      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text' } });

      // then
      expectEntries(result.container, [
        { type: 'textfield' },
        { type: 'textarea' },
        { type: 'text' }
      ]);
    });


    it('should ignore spaces in search', function() {

      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text field' } });

      // then
      expectEntries(result.container, [
        { type: 'textfield' }
      ]);
    });

  });


  describe('clear', function() {

    it('should not display clear', async function() {

      // given
      const result = createPalette({ container });

      const clear = result.container.querySelector('.fjs-palette-search-clear');

      // then
      expect(clear).to.not.exist;
    });


    it('should display clear', async function() {

      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text' } });

      const clear = result.container.querySelector('.fjs-palette-search-clear');

      // then
      expect(clear).to.exist;
    });


    it('should clear', async function() {

      // given
      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      fireEvent.input(search, { target: { value: 'text' } });

      // assume
      expectEntries(result.container, [
        { type: 'textfield' },
        { type: 'textarea' },
        { type: 'text' }
      ]);

      const clear = result.container.querySelector('.fjs-palette-search-clear');

      // when
      fireEvent.click(clear);

      // then
      expectEntries(result.container, PALETTE_ENTRIES);
    });

  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const result = createPalette({ container });

      // then
      // @Note(pinussilvestrus): the palette entries are currently
      // not keyboard accessible, as we need to invest in an overall
      // editor keyboard experience
      // cf. https://github.com/bpmn-io/form-js/issues/536
      await expectNoViolations(result.container, {
        rules: {
          'scrollable-region-focusable': {
            enabled: false
          }
        }
      });
    });


    it('should have no violations - searched', async function() {

      // given
      this.timeout(5000);

      const result = createPalette({ container });

      const search = result.container.querySelector('.fjs-palette-search');

      // when
      fireEvent.input(search, { target: { value: 'text' } });

      // then
      await expectNoViolations(result.container, {
        rules: {
          'scrollable-region-focusable': {
            enabled: false
          }
        }
      });
    });

  });

});


// helper ///////////////

function createPalette(options = {}) {
  const { container } = options;

  return render(
    WithFormEditorContext(<Palette />),
    {
      container
    }
  );
}

function expectEntries(container, fieldTypes) {
  fieldTypes.forEach(({ type }) => {
    expect(container.querySelector(`[data-field-type="${type}"]`)).to.exist;
  });
}

function expectGroups(container, groups) {
  groups.forEach(({ id }) => {
    expect(container.querySelector(`[data-group-id="${id}"]`)).to.exist;
  });
}