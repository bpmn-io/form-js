import {
  fireEvent,
  render,
  screen
} from '@testing-library/preact/pure';

import { Taglist } from '../../../../../src/render/components/form-fields/Taglist';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

const spy = sinon.spy;

let formContainer;


describe('Taglist', function() {

  beforeEach(function() {
    formContainer = createFormContainer();
  });

  afterEach(function() {
    formContainer.remove();
  });


  it('should render', function() {

    // when
    const { container } = createTaglist({
      value: [],
      onchange: () => {}
    });

    // then
    const formField = container.querySelector('.fjs-form-field');
    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-taglist')).to.be.true;

    const label = container.querySelector('label');
    expect(label).to.exist;
    expect(label.textContent).to.equal('Taglist');

    const filterInput = container.querySelector('input[type="text"]');
    expect(filterInput).to.exist;
    expect(filterInput.value).to.be.empty;

    const taglistAnchor = container.querySelector('.fjs-taglist-anchor');
    expect(taglistAnchor).to.exist;
    expect(taglistAnchor.children).to.be.empty;

  });


  it('should render required label', function() {

    // when
    const { container } = createTaglist({
      value: [],
      onchange: () => {},
      field: {
        ...defaultField,
        label: 'Required',
        validate: {
          required: true
        }
      }
    });

    // then
    const label = container.querySelector('label');
    expect(label).to.exist;
    expect(label.textContent).to.equal('Required*');
  });


  it('should render tags', function() {

    // when
    const { container } = createTaglist({
      value: [ 'tag1', 'tag2', 'tag3' ],
      onchange: () => {}
    });

    // then
    const tags = container.querySelectorAll('.fjs-taglist-tag');
    expect(tags).to.have.length(3);

    const tag = tags[0];
    const tagLabelArea = tag.querySelector('.fjs-taglist-tag-label');
    expect(tagLabelArea).to.exist;

    const tagDeleteArea = tag.querySelector('.fjs-taglist-tag-remove');
    expect(tagLabelArea).to.exist;

    const tagCross = tagDeleteArea.querySelector('svg');
    expect(tagCross).to.exist;

  });


  it('should render tags via valuesKey', function() {

    // when
    const { container } = createTaglist({
      value: [ 'dynamicValue1', 'dynamicValue2' ],
      onchange: () => { },
      field: dynamicField,
      initialData: dynamicFieldInitialData
    });

    // then
    const tags = container.querySelectorAll('.fjs-taglist-tag');
    expect(tags).to.have.length(2);

    const tag = tags[0];
    const tagLabelArea = tag.querySelector('.fjs-taglist-tag-label');
    expect(tagLabelArea).to.exist;

    const tagDeleteArea = tag.querySelector('.fjs-taglist-tag-remove');
    expect(tagLabelArea).to.exist;

    const tagCross = tagDeleteArea.querySelector('svg');
    expect(tagCross).to.exist;
  });


  it('should render tags via valuesExpression', function() {

    // when
    const options = [
      ...expressionFieldInitialData.list1,
      ...expressionFieldInitialData.list2
    ];

    const { container } = createTaglist({
      value: [ 'value1', 'value3' ],
      onchange: () => { },
      field: expressionField,
      initialData: expressionFieldInitialData,
      services: {
        expressionLanguage: {
          isExpression: () => true,
          evaluate: () => options
        }
      }
    });

    // then
    const tags = container.querySelectorAll('.fjs-taglist-tag');
    expect(getTagValues(container)).to.eql([ 'Value 1', 'Value 3' ]);

    const tag = tags[0];
    const tagLabelArea = tag.querySelector('.fjs-taglist-tag-label');
    expect(tagLabelArea).to.exist;

    const tagDeleteArea = tag.querySelector('.fjs-taglist-tag-remove');
    expect(tagLabelArea).to.exist;

    const tagCross = tagDeleteArea.querySelector('svg');
    expect(tagCross).to.exist;
  });


  it('should update tags via valuesExpression - evaluation changed', function() {

    // given
    const options = [
      ...expressionFieldInitialData.list1,
      ...expressionFieldInitialData.list2
    ];

    const result = createTaglist({
      value: [ 'value1', 'value3' ],
      onchange: () => { },
      field: expressionField,
      initialData: expressionFieldInitialData,
      services: {
        expressionLanguage: {
          isExpression: () => true,
          evaluate: () => options
        }
      }
    });

    // assume
    expect(getTagValues(result.container)).to.eql([ 'Value 1', 'Value 3' ]);

    // when
    createTaglist({
      value: [ 'value1', 'value5' ],
      onchange: () => { },
      field: expressionField,
      initialData: expressionFieldInitialData,
      services: {
        expressionLanguage: {
          isExpression: () => true,
          evaluate: () => [
            ...options,
            ...[ { label: 'Value 5', value: 'value5' } ]
          ]
        }
      }
    }, result.rerender);

    // then
    expect(getTagValues(result.container)).to.eql([ 'Value 1', 'Value 5' ]);
  });


  it('should render dropdown when filter focused', function() {

    // when
    const { container } = createTaglist({
      value: [ 'tag1', 'tag2', 'tag3' ],
      onChange: () => {}
    });

    const filterInput = container.querySelector('input[type="text"]');

    fireEvent.focus(filterInput);

    // then
    const taglistAnchor = container.querySelector('.fjs-taglist-anchor');
    expect(taglistAnchor).to.exist;

    const dropdownList = taglistAnchor.querySelector('.fjs-dropdownlist');
    expect(dropdownList).to.exist;

  });


  it('should NOT render dropdown when filter unfocused', function() {

    // when
    const { container } = createTaglist({
      value: [ 'tag1', 'tag2', 'tag3' ],
      onChange: () => {}
    });

    // then
    const taglistAnchor = container.querySelector('.fjs-taglist-anchor');
    expect(taglistAnchor).to.exist;

    const dropdownList = taglistAnchor.querySelector('.fjs-dropdownlist');
    expect(dropdownList).to.not.exist;

  });


  it('should render disabled', function() {

    // when
    const { container } = createTaglist({
      disabled: true,
      value: [ 'tag1' ]
    });

    // then
    const filterInput = container.querySelector('input[type="text"]');
    expect(filterInput.disabled).to.be.true;

    const taglist = container.querySelector('.fjs-taglist');
    expect(taglist.classList.contains('fjs-disabled')).to.be.true;

    const tag = taglist.querySelector('.fjs-taglist-tag');
    expect(tag).to.exist;
    expect(tag.innerText).to.equal('Tag1');
    expect(tag.classList.contains('fjs-disabled')).to.be.true;

    const cross = tag.querySelector('fjs-taglist-tag-remove');
    expect(cross).to.not.exist;

  });


  it('should render readonly', function() {

    // when
    const { container } = createTaglist({
      readonly: true,
      value: [ 'tag1' ]
    });

    // then
    const filterInput = container.querySelector('input[type="text"]');
    expect(filterInput.readOnly).to.be.true;

    const taglist = container.querySelector('.fjs-taglist');
    expect(taglist.classList.contains('fjs-readonly')).to.be.true;

    const tag = taglist.querySelector('.fjs-taglist-tag');
    expect(tag).to.exist;
    expect(tag.innerText).to.equal('Tag1');
    expect(tag.classList.contains('fjs-readonly')).to.be.true;

    const cross = tag.querySelector('fjs-taglist-tag-remove');
    expect(cross).to.not.exist;

  });


  it('should render description', function() {

    // when
    const { container } = createTaglist({
      field: {
        ...defaultField,
        description: 'foo'
      }
    });

    // then
    const description = container.querySelector('.fjs-form-field-description');

    expect(description).to.exist;
    expect(description.textContent).to.equal('foo');
  });


  it('should render skip to search link', function() {

    // when
    const { container } = createTaglist({
      field: {
        ...defaultField
      },
      value: [ 'tag1', 'tag2', 'tag3' ]
    });

    // then
    const skipLink = container.querySelector('.fjs-taglist-skip-link');

    expect(skipLink).to.exist;
  });


  describe('interaction', function() {

    describe('tag deletion', function() {

      it('should work via mouse', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createTaglist({
          onChange: onChangeSpy,
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const removeButton = container.querySelectorAll('.fjs-taglist-tag-remove')[ 1 ];

        fireEvent.click(removeButton);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: defaultField,
          value: [ 'tag1', 'tag3' ]
        });
      });


      it('should work via backspace keyboard', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createTaglist({
          onChange: onChangeSpy,
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.keyDown(filterInput, { key: 'Backspace', code: 'Backspace' });

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: defaultField,
          value: [ 'tag1', 'tag2' ]
        });
      });


      it('should work with dynamic data', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createTaglist({
          value: [ 'dynamicValue1', 'dynamicValue2' ],
          onChange: onChangeSpy,
          field: dynamicField,
          initialData: dynamicFieldInitialData
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.keyDown(filterInput, { key: 'Backspace', code: 'Backspace' });

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: dynamicField,
          value: [ 'dynamicValue1' ]
        });
      });


      it('restore focus if last tag got removed', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createTaglist({
          onChange: onChangeSpy,
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const removeButton = container.querySelectorAll('.fjs-taglist-tag-remove')[ 2 ];

        fireEvent.click(removeButton);

        // then
        expect(document.activeElement).to.equal(container.querySelector('.fjs-taglist-input'));
      });

    });

    describe('filtering', function() {

      it('should filter dropdown', function() {

        // given
        const eventBusFireSpy = spy();
        const eventBus = {
          fire: eventBusFireSpy
        };

        const { container } = createTaglist({
          onChange: () => {},
          services: { eventBus },
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.focus(filterInput);

        const dropdownList = container.querySelector('.fjs-dropdownlist');
        expect(dropdownList).to.exist;
        expect(dropdownList.children.length).to.equal(8);

        // then
        fireEvent.input(filterInput, { target: { value: '4' } });
        expect(dropdownList.children.length).to.equal(1);
        expect(eventBusFireSpy).to.have.been.calledWith('formField.search', {
          formField: defaultField,
          value: '4'
        });

        fireEvent.input(filterInput, { target: { value: 'Tag' } });
        expect(dropdownList.children.length).to.equal(8);
        expect(eventBusFireSpy).to.have.been.calledWith('formField.search', {
          formField: defaultField,
          value: 'Tag'
        });

      });


      it ('should filter dropdown case insensitively', function() {

        const { container } = createTaglist({
          onChange: () => {},
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.focus(filterInput);

        const dropdownList = container.querySelector('.fjs-dropdownlist');
        expect(dropdownList).to.exist;
        fireEvent.input(filterInput, { target: { value: 'Tag' } });
        expect(dropdownList.children.length).to.equal(8);

        // then
        fireEvent.input(filterInput, { target: { value: 'TAG' } });
        expect(dropdownList.children.length).to.equal(8);

        fireEvent.input(filterInput, { target: { value: 'tAg' } });
        expect(dropdownList.children.length).to.equal(8);

      });


      it('should filter dropdown for dynamic data', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createTaglist({
          value: [ 'dynamicValue1', 'dynamicValue2' ],
          onChange: onChangeSpy,
          field: dynamicField,
          initialData: dynamicFieldInitialData
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.focus(filterInput);

        const dropdownList = container.querySelector('.fjs-dropdownlist');
        expect(dropdownList).to.exist;
        expect(dropdownList.children.length).to.equal(2);

        // then
        fireEvent.input(filterInput, { target: { value: '4' } });
        expect(dropdownList.children.length).to.equal(1);

        fireEvent.input(filterInput, { target: { value: 'dyna' } });
        expect(dropdownList.children.length).to.equal(2);

      });
    });

  });

  describe('dropdown', function() {

    describe('items', function() {

      it('should not render invalid items', function() {

        // when
        const { container } = createTaglist({
          onchange: () => { },
          field: dynamicField,
          initialData: {
            dynamicValues: [
              {
                value: { foo: 'bar' }
              },
              {
                label: 'Dynamic Value 2',
              }
            ] }
        });

        // then
        const filterInput = container.querySelector('input[type="text"]');

        fireEvent.focus(filterInput);

        // then
        const taglistAnchor = container.querySelector('.fjs-taglist-anchor');
        expect(taglistAnchor).to.exist;

        const dropdownList = taglistAnchor.querySelector('.fjs-dropdownlist');
        expect(dropdownList).to.exist;

        const dropdownItems = dropdownList.querySelectorAll('.fjs-dropdownlist-item');
        expect(dropdownItems).to.have.length(0);

      });

    });


    describe('filtering', function() {

      it ('should render no results state', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createTaglist({
          onChange: onChangeSpy,
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.focus(filterInput);

        const dropdownList = container.querySelector('.fjs-dropdownlist');
        expect(dropdownList).to.exist;
        expect(dropdownList.children.length).to.equal(8);

        // then
        fireEvent.input(filterInput, { target: { value: 'iahdisdisad' } });
        expect(dropdownList.children.length).to.equal(1);

        const noResults = dropdownList.querySelector('.fjs-dropdownlist-empty');
        expect(noResults).to.exist;
        expect(noResults.innerText).to.equal('No results');

      });


      it('should render all selected state', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createTaglist({
          onChange: onChangeSpy,
          value: [ 'tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag9', 'tag8', 'tag10', 'tag11' ]
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.focus(filterInput);

        const dropdownList = container.querySelector('.fjs-dropdownlist');
        expect(dropdownList).to.exist;

        // then
        expect(dropdownList.children.length).to.equal(1);

        const allSelected = dropdownList.querySelector('.fjs-dropdownlist-empty');
        expect(allSelected).to.exist;
        expect(allSelected.innerText).to.equal('All values selected');

      });

    });

    describe('navigation', function() {

      it('should work via keyboard', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createTaglist({
          onChange: onChangeSpy,
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.focus(filterInput);

        const dropdownList = container.querySelector('.fjs-dropdownlist');

        // then
        let focusedItem = dropdownList.querySelector('.fjs-dropdownlist-item.focused');
        expect(focusedItem.innerText).to.equal('Tag4');

        fireEvent.keyDown(filterInput, { key: 'ArrowDown', code: 'ArrowDown' });
        fireEvent.keyDown(filterInput, { key: 'ArrowDown', code: 'ArrowDown' });
        focusedItem = dropdownList.querySelector('.fjs-dropdownlist-item.focused');

        expect(focusedItem.innerText).to.equal('Tag6');

        fireEvent.keyDown(filterInput, { key: 'ArrowUp', code: 'ArrowUp' });
        focusedItem = dropdownList.querySelector('.fjs-dropdownlist-item.focused');

        expect(focusedItem.innerText).to.equal('Tag5');

      });


      it('should work via mouse', function() {

        const onChangeSpy = spy();

        const { container } = createTaglist({
          onChange: onChangeSpy,
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.focus(filterInput);

        const dropdownList = container.querySelector('.fjs-dropdownlist');

        // then
        const tag5 = dropdownList.querySelectorAll('.fjs-dropdownlist-item')[1];
        const tag6 = dropdownList.querySelectorAll('.fjs-dropdownlist-item')[2];

        expect(tag5.innerText).to.equal('Tag5');
        expect(tag6.innerText).to.equal('Tag6');

        const isFocused = (node) => node.classList.contains('focused');

        expect(isFocused(tag5)).to.be.false;
        expect(isFocused(tag6)).to.be.false;

        // first focus detection in `keyboard` mode is captured by mouseMove, so mouseEnter will not work to change the state
        fireEvent.mouseEnter(tag6);
        expect(isFocused(tag5)).to.be.false;
        expect(isFocused(tag6)).to.be.false;

        // mouseMove should work
        fireEvent.mouseMove(tag6);
        expect(isFocused(tag5)).to.be.false;
        expect(isFocused(tag6)).to.be.true;

        // second detection is captured via mouseEnter, hence mouseMove will not work to change the state
        fireEvent.mouseMove(tag5);
        expect(isFocused(tag5)).to.be.false;
        expect(isFocused(tag6)).to.be.true;

        // mouseEnter should work
        fireEvent.mouseEnter(tag5);
        expect(isFocused(tag5)).to.be.true;
        expect(isFocused(tag6)).to.be.false;
      });

    });

    describe('selection', function() {

      it('should work via mouse', function() {

        // given
        const onChangeSpy = spy();

        const { container } = createTaglist({
          onChange: onChangeSpy,
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const filterInput = container.querySelector('.fjs-taglist-input');
        fireEvent.focus(filterInput);

        const focusedItem = container.querySelector('.fjs-dropdownlist-item.focused');
        fireEvent.mouseDown(focusedItem);

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: defaultField,
          value: [ 'tag1', 'tag2', 'tag3', 'tag4' ]
        });
      });


      it('should work via keyboard', function() {

        // given
        const onChangeSpy = spy();

        const taglist = createTaglist({
          onChange: onChangeSpy,
          value: [ 'tag1', 'tag2', 'tag3' ]
        });

        // when
        const filterInput = taglist.container.querySelector('.fjs-taglist-input');
        fireEvent.focus(filterInput);
        fireEvent.keyDown(filterInput, { key: 'Enter', code: 'Enter' });

        // then
        expect(onChangeSpy).to.have.been.calledWith({
          field: defaultField,
          value: [ 'tag1', 'tag2', 'tag3', 'tag4' ]
        });
      });
    });

  });


  it('#create', function() {

    // assume
    const { config } = Taglist;
    expect(config.type).to.eql('taglist');
    expect(config.label).to.eql('Tag list');
    expect(config.group).to.eql('selection');
    expect(config.keyed).to.be.true;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({
      values: [
        {
          label: 'Value',
          value: 'value'
        }
      ]
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

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createTaglist({
        value: [ 'tag1', 'tag2', 'tag3' ]
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for readonly', async function() {

      // given
      this.timeout(10000);

      const { container } = createTaglist({
        value: [ 'tag1', 'tag2', 'tag3' ],
        readonly: true
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations for errors', async function() {

      // given
      this.timeout(10000);

      const { container } = createTaglist({
        value: [ 'tag1', 'tag2', 'tag3' ],
        errors: [ 'Something went wrong' ]
      });

      // then
      await expectNoViolations(container);
    });


    it('should have no violations - focus on', async function() {

      // given
      this.timeout(10000);

      const { container } = createTaglist({
        value: [ 'tag1', 'tag2', 'tag3' ]
      });


      const input = screen.getByLabelText('Taglist');
      fireEvent.focus(input);

      // then
      // @Note: we ignore the dropdownlist is not focussable,
      // as it is keyboard navigatible via up/down keys
      await expectNoViolations(container, {
        rules: {
          'scrollable-region-focusable': {
            enabled: false
          }
        }
      });
    });

  });

  it('should not submit form on enter', function() {

    // given
    const onSubmitSpy = spy();

    const { container } = createTaglist({
      onChange: () => {},
      value: [ 'tag1', 'tag2', 'tag3' ],
    });

    container.addEventListener('keydown', onSubmitSpy);

    // when
    const filterInput = container.querySelector('.fjs-taglist-input');
    fireEvent.focus(filterInput);
    fireEvent.keyDown(filterInput, { key: 'Enter', code: 'Enter' });

    // then

    expect(onSubmitSpy).to.not.have.been.called;
  });

});

// helpers //////////

const defaultField = {
  id: 'Taglist_1',
  key: 'tags',
  label: 'Taglist',
  type: 'taglist',
  description: 'taglist',
  'values': [
    {
      'label': 'Tag1',
      'value': 'tag1'
    },
    {
      'label': 'Tag2',
      'value': 'tag2'
    },
    {
      'label': 'Tag3',
      'value': 'tag3'
    },
    {
      'label': 'Tag4',
      'value': 'tag4'
    },
    {
      'label': 'Tag5',
      'value': 'tag5'
    },
    {
      'label': 'Tag6',
      'value': 'tag6'
    },
    {
      'label': 'Tag7',
      'value': 'tag7'
    },
    {
      'label': 'Tag8',
      'value': 'tag8'
    },
    {
      'label': 'Tag9',
      'value': 'tag9'
    },
    {
      'label': 'Tag10',
      'value': 'tag10'
    },
    {
      'label': 'Tag11',
      'value': 'tag11'
    }
  ]
};

const dynamicField = {
  id: 'Taglist_1',
  key: 'tags',
  label: 'Taglist',
  type: 'taglist',
  valuesKey: 'dynamicValues'
};

const expressionField = {
  id: 'Taglist_1',
  key: 'tags',
  label: 'Taglist',
  type: 'taglist',
  valuesExpression: '=concatenate(list1,list2)'
};

const dynamicFieldInitialData = {
  dynamicValues: [
    {
      label: 'Dynamic Value 1',
      value: 'dynamicValue1'
    },
    {
      label: 'Dynamic Value 2',
      value: 'dynamicValue2'
    },
    {
      label: 'Dynamic Value 3',
      value: 'dynamicValue3'
    },
    {
      label: 'Dynamic Value 4',
      value: 'dynamicValue4'
    }
  ]
};

const expressionFieldInitialData = {
  list1: [
    {
      label: 'Value 1',
      value: 'value1'
    },
    {
      label: 'Value 2',
      value: 'value2'
    }
  ],
  list2: [
    {
      label: 'Value 3',
      value: 'value3'
    },
    {
      label: 'Value 4',
      value: 'value4'
    }
  ]
};

function createTaglist({ services, ...restOptions } = {}, renderFn = render) {
  const options = {
    domId: 'test-taglist',
    field: defaultField,
    onChange: () => {},
    ...restOptions
  };

  return renderFn(
    <MockFormContext
      services={ services }
      options={ options }>
      <Taglist
        domId={ options.domId }
        disabled={ options.disabled }
        readonly={ options.readonly }
        errors={ options.errors }
        field={ options.field }
        onChange={ options.onChange }
        onBlur={ options.onBlur }
        value={ options.value } />
    </MockFormContext>, {
      container: options.container || formContainer.querySelector('.fjs-form')
    }
  );
}

function getTagValues(container) {
  const tags = container.querySelectorAll('.fjs-taglist-tag');

  return Array.from(tags).map(tag => tag.textContent);
}