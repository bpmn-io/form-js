import { expect } from 'chai';
import { act } from '@testing-library/preact/pure';

import { createFormEditor } from '../../../../../src';

import { insertStyles } from '../../../../TestHelper';

import schema from '../../../form-multipage.json';

insertStyles();

describe('EditorMultiPage', function () {
  let container, formEditor;

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

  const bootstrapFormEditor = () => {
    return act(async () => {
      formEditor = await createFormEditor({ container, schema });
    });
  };

  it('should lay out every page at once', async function () {
    // when
    await bootstrapFormEditor();

    // then
    const pages = container.querySelectorAll('.fjs-form-field-page');

    expect(pages).to.have.length(2);

    pages.forEach((page) => {
      expect(page.closest('.fjs-layout-row').style.display).to.not.equal('none');
    });
  });

  it('should ignore page conditions', async function () {
    // when
    await bootstrapFormEditor();

    // then
    // Page_2 hides itself in the viewer, but stays editable here
    expect(container.querySelector('[data-id="Page_2"]')).to.exist;
  });

  it('should not render navigation controls', async function () {
    // when
    await bootstrapFormEditor();

    // then
    expect(container.querySelector('.fjs-multipage-navigation')).to.not.exist;
  });

  it('should offer a drop target per page', async function () {
    // when
    await bootstrapFormEditor();

    // then
    const dropTargets = container.querySelectorAll('[data-id="Page_1"] .fjs-children, [data-id="Page_2"] .fjs-children');

    expect(dropTargets).to.have.length(2);
  });
});
