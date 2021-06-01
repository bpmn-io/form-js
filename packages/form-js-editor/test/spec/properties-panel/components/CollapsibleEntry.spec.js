import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { CollapsibleEntry } from '../../../../src/render/components/properties-panel/components';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('CollapsibleEntry', function() {

  afterEach(() => cleanup());


  it('should render', function() {

    // when
    const { container } = render(
      <CollapsibleEntry label="Foo">
        <span class="foo">Foo</span>
      </CollapsibleEntry>
    );

    // then
    expect(container.querySelector('.fjs-properties-panel-collapsible-entry-header')).to.exist;

    const entries = container.querySelector('.fjs-properties-panel-collapsible-entry-entries');

    expect(entries).to.exist;
    expect(entries.querySelector('.foo')).to.exist;
  });


  it('should toggle open', function() {

    // when
    const { container } = render(
      <CollapsibleEntry label="Foo" />
    );

    // then
    const toggleOpen = container.querySelector('.fjs-properties-panel-collapsible-entry-header');

    fireEvent.click(toggleOpen);

    expect(container.querySelector('.fjs-properties-panel-collapsible-entry-entries')).not.to.exist;

    fireEvent.click(toggleOpen);

    expect(container.querySelector('.fjs-properties-panel-collapsible-entry-entries')).to.exist;
  });


  it('should remove entry', function() {

    // given
    const removeEntrySpy = spy();

    const { container } = render(
      <CollapsibleEntry removeEntry={ removeEntrySpy } label="Foo" />
    );

    // when
    const removeEntry = container.querySelector('.fjs-properties-panel-collapsible-entry-header-remove-entry');

    fireEvent.click(removeEntry);

    // then
    expect(removeEntrySpy).to.have.been.called;
  });

});