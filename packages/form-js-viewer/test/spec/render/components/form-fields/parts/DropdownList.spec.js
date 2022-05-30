import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import DropdownList from '../../../../../../src/render/components/form-fields/parts/DropdownList';

import { createFormContainer } from '../../../../../TestHelper';

let formContainer;


describe('DropdownList', function() {

  beforeEach(function() {
    formContainer = createFormContainer();
  });

  afterEach(function() {
    formContainer.remove();
  });


  it('should render', function() {

    // when
    const { container } = createDropdownList({
      values: ['item1', 'item2']
    });

    // then
    const dropdownList = container.querySelector('.fjs-dropdownlist');
    expect(dropdownList).to.exist;

    expect(dropdownList.children.length).to.equal(2);

    const dropdownListItems = dropdownList.querySelectorAll('.fjs-dropdownlist-item');
    expect(dropdownListItems.length).to.equal(2);
    expect(dropdownListItems[0].innerText).to.equal('item1');
    expect(dropdownListItems[1].innerText).to.equal('item2');

  });

  it('should render custom label mappings', function() {

    // given
    const { container } = createDropdownList({
      values: [ { label: 'item1' }, { label: 'item2' } ],
      getLabel: v => '> ' + v.label
    });

    const dropdownList = container.querySelector('.fjs-dropdownlist');
    expect(dropdownList).to.exist;

    // then
    expect(dropdownList.children.length).to.equal(2);

    const dropdownListItems = dropdownList.querySelectorAll('.fjs-dropdownlist-item');
    expect(dropdownListItems.length).to.equal(2);
    expect(dropdownListItems[0].innerText).to.equal('> item1');
    expect(dropdownListItems[1].innerText).to.equal('> item2');

  });


  it('should render complex custom label mappings', function() {

    // given
    const getLabel = (v) => <div class="customClass">{v + ':' + v}</div>;

    const { container } = createDropdownList({
      values: [ 'item1', 22 ],
      getLabel
    });

    const dropdownList = container.querySelector('.fjs-dropdownlist');
    expect(dropdownList).to.exist;

    // then
    expect(dropdownList.children.length).to.equal(2);

    const dropdownListItems = dropdownList.querySelectorAll('.fjs-dropdownlist-item');
    expect(dropdownListItems.length).to.equal(2);

    const subDiv1 = dropdownListItems[0].querySelector('div');
    expect(subDiv1.classList.contains('customClass')).to.be.true;
    expect(subDiv1.innerText).to.equal('item1:item1');

    const subDiv2 = dropdownListItems[1].querySelector('div');
    expect(subDiv2.classList.contains('customClass')).to.be.true;
    expect(subDiv2.innerText).to.equal('22:22');

  });


  describe('navigation', function() {

    it('should work via keyboard', function() {

      // given
      const { container } = createDropdownList({
        values: ['value1', 'value2', 'value3']
      });

      // when
      const dropdownList = container.querySelector('.fjs-dropdownlist');

      // then
      let focusedItem = dropdownList.querySelector('.fjs-dropdownlist-item.focused');
      expect(focusedItem.innerText).to.equal('value1');

      fireEvent.keyDown(container, { key: 'ArrowDown', code: 'ArrowDown' });
      fireEvent.keyDown(container, { key: 'ArrowDown', code: 'ArrowDown' });
      focusedItem = dropdownList.querySelector('.fjs-dropdownlist-item.focused');

      expect(focusedItem.innerText).to.equal('value3');

      fireEvent.keyDown(container, { key: 'ArrowUp', code: 'ArrowUp' });
      focusedItem = dropdownList.querySelector('.fjs-dropdownlist-item.focused');

      expect(focusedItem.innerText).to.equal('value2');

    });


    it ('should work via mouse', function() {

      // given
      const { container } = createDropdownList({
        values: [ 'value1', 'value2', 'value3' ]
      });

      // when
      const dropdownList = container.querySelector('.fjs-dropdownlist');

      // then
      const toFocus = dropdownList.querySelectorAll('.fjs-dropdownlist-item')[2];
      expect(toFocus.innerText).to.equal('value3');
      expect(toFocus.classList.contains('focused')).to.be.false;

      fireEvent.mouseEnter(toFocus);
      expect(toFocus.classList.contains('focused')).to.be.true;

      fireEvent.keyDown(container, { key: 'ArrowUp', code: 'ArrowUp' });
      expect(toFocus.classList.contains('focused')).to.be.false;

      fireEvent.mouseMove(toFocus);
      expect(toFocus.classList.contains('focused')).to.be.true;

    });

  });

});

function createDropdownList(options = {}) {
  const {
    values = [],
    getLabel = v => v,
    onValueSelected = () => {},
    height = 180,
    emptyListMessage = 'No results',
  } = options;

  const container = options.container || formContainer.querySelector('.fjs-form');

  return render(
    <DropdownList
      keyEventsListener={ container }
      values={ values }
      getLabel={ getLabel }
      onValueSelected={ onValueSelected }
      height={ height }
      emptyListMessage={ emptyListMessage } />
    , {
      container
    });
}