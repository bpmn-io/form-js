import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/preact/pure';

import { Group } from '../../../../src/render/components/properties-panel/components';

import { insertStyles } from '../../../TestHelper';

insertStyles();

const spy = sinon.spy;


describe('Group', function() {

  afterEach(() => cleanup());


  it('should render', function() {

    // when
    const { container } = render(
      <Group label="Foo">
        <span class="foo">Foo</span>
      </Group>
    );

    // then
    expect(container.querySelector('.fjs-properties-panel-group-header')).to.exist;

    const entries = container.querySelector('.fjs-properties-panel-group-entries');

    expect(entries).to.exist;
    expect(entries.querySelector('.foo')).to.exist;
  });


  it('should render (hasEntries=false)', function() {

    // when
    const { container } = render(
      <Group hasEntries={ false } label="Foo" />
    );

    // then
    expect(container.querySelector('.fjs-properties-panel-group-header')).to.exist;
    expect(container.querySelector('.fjs-properties-panel-group-entries')).not.to.exist;
  });


  it('should toggle open', function() {

    // when
    const { container } = render(
      <Group label="Foo" />
    );

    // then
    const toggleOpen = container.querySelector('.fjs-properties-panel-group-header-button-toggle-open');

    fireEvent.click(toggleOpen);

    expect(container.querySelector('.fjs-properties-panel-group-entries')).not.to.exist;

    fireEvent.click(toggleOpen);

    expect(container.querySelector('.fjs-properties-panel-group-entries')).to.exist;
  });


  it('should add entry', function() {

    // given
    const addEntrySpy = spy();

    const { container } = render(
      <Group addEntry={ addEntrySpy } label="Foo" />
    );

    // when
    const addEntry = container.querySelector('.fjs-properties-panel-group-header-button-add-entry');

    fireEvent.click(addEntry);

    // then
    expect(addEntrySpy).to.have.been.called;
  });


  it('should open when adding entry', function() {

    // given
    const { container } = render(
      <Group addEntry={ () => {} } label="Foo" />
    );

    const toggleOpen = container.querySelector('.fjs-properties-panel-group-header');

    fireEvent.click(toggleOpen);

    // assume
    expect(container.querySelector('.fjs-properties-panel-group-entries')).not.to.exist;

    // when
    const addEntry = container.querySelector('.fjs-properties-panel-group-header-button-add-entry');

    fireEvent.click(addEntry);

    // then
    expect(container.querySelector('.fjs-properties-panel-group-entries')).to.exist;
  });

});