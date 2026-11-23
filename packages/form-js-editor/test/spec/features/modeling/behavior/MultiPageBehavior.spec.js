import { expect } from 'chai';
import { bootstrapFormEditor, inject } from '../../../../TestHelper';

import { ModelingModule } from 'src/features/modeling';

import schema from '../../../form-multipage.json';

describe('features/modeling - MultiPageBehavior', function () {
  beforeEach(
    bootstrapFormEditor(schema, {
      additionalModules: [ModelingModule],
    }),
  );

  it('should start a new multi page container with two pages', inject(function (modeling, formFieldRegistry) {
    // given
    const parent = formFieldRegistry.get('MultiPageForm');

    // when
    const multiPage = modeling.addFormField({ type: 'multipage' }, parent, 1);

    // then
    expect(multiPage.components.map(({ type }) => type)).to.eql(['page', 'page']);
    expect(multiPage.components.map(({ label }) => label)).to.eql(['Page 1', 'Page 2']);

    multiPage.components.forEach((page) => {
      expect(formFieldRegistry.get(page.id)).to.equal(page);
    });
  }));

  it('should select the new container', inject(function (modeling, formFieldRegistry, selection) {
    // given
    const parent = formFieldRegistry.get('MultiPageForm');

    // when
    const multiPage = modeling.addFormField({ type: 'multipage' }, parent, 1);

    // then
    expect(selection.isSelected(multiPage)).to.be.true;
  }));

  it('should remove the container and its pages in a single undo', inject(function (
    modeling,
    formFieldRegistry,
    commandStack,
  ) {
    // given
    const parent = formFieldRegistry.get('MultiPageForm');

    const multiPage = modeling.addFormField({ type: 'multipage' }, parent, 1);
    const pageIds = multiPage.components.map(({ id }) => id);

    // when
    commandStack.undo();

    // then
    expect(parent.components.map(({ id }) => id)).to.eql(['Multipage_1']);
    expect(formFieldRegistry.get(multiPage.id)).to.not.exist;

    pageIds.forEach((id) => {
      expect(formFieldRegistry.get(id)).to.not.exist;
    });
  }));

  it('should restore the container and its pages on redo', inject(function (modeling, formFieldRegistry, commandStack) {
    // given
    const parent = formFieldRegistry.get('MultiPageForm');

    const multiPage = modeling.addFormField({ type: 'multipage' }, parent, 1);

    commandStack.undo();

    // when
    commandStack.redo();

    // then
    expect(formFieldRegistry.get(multiPage.id)).to.exist;
    expect(multiPage.components).to.have.length(2);
  }));

  it('should keep the pages of an imported container', inject(function (formFieldRegistry) {
    // then
    const multiPage = formFieldRegistry.get('Multipage_1');

    expect(multiPage.components.map(({ id }) => id)).to.eql(['Page_1', 'Page_2']);
  }));

  it('should not add pages when adding a page', inject(function (modeling, formFieldRegistry) {
    // given
    const multiPage = formFieldRegistry.get('Multipage_1');

    // when
    const page = modeling.addFormField({ type: 'page' }, multiPage, 2);

    // then
    expect(multiPage.components.map(({ id }) => id)).to.eql(['Page_1', 'Page_2', page.id]);
    expect(page.components).to.be.empty;
  }));
});
