import { render } from '@testing-library/preact/pure';
import { DynamicList } from '../../../../../src/render/components/form-fields/DynamicList';
import { createFormContainer, expectNoViolations } from '../../../../TestHelper';
import { MockFormContext } from '../helper';

let container;

describe('Dynamic List', () => {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });

  it('should render with children', function() {

    // when
    const { container } = createDynamicList();

    // then
    const dynamicList = container.querySelector('.fjs-form-field-grouplike');
    expect(dynamicList).to.exist;

    const label = dynamicList.querySelector('label');
    expect(label.textContent).to.equal('Dynamic list');

    const textfields = dynamicList.querySelectorAll('.fjs-form-field-textfield');

    expect(textfields).to.have.length(4);

    const verifyTextField = (textfield, textContent, id) => {

      expect(textfield).to.exist;

      const label = textfield.querySelector('label');
      const input = textfield.querySelector('input');

      expect(label.textContent).to.equal(textContent);
      expect(label.htmlFor).to.equal(id);
      expect(input.id).to.equal(id);
    };

    verifyTextField(textfields[0], 'Creditor', 'fjs-form-foo-Textfield_1_0');
    verifyTextField(textfields[1], 'Debitor', 'fjs-form-foo-Textfield_2_0');
    verifyTextField(textfields[2], 'Creditor', 'fjs-form-foo-Textfield_1_1');
    verifyTextField(textfields[3], 'Debitor', 'fjs-form-foo-Textfield_2_1');
  });


  it('should render without children', function() {

    // given
    const { container } = createDynamicList({
      field: {
        ...defaultField,
        components: []
      }
    });

    // then
    const dynamicList = container.querySelector('.fjs-form-field-grouplike');
    expect(dynamicList).to.exist;
  });


  it('should show collapse button when more items are visible than default collapse', function() {

    // given
    const field = {
      ...defaultField,
      nonCollapsedItems: 1
    };

    // when
    const { container } = createDynamicList({ field });

    // then
    const collapseButton = container.querySelector('.fjs-repeat-render-collapse');
    expect(collapseButton).to.exist;
  });


  it('should not show collapse button when less items are visible than default collapse', function() {

    // given
    const field = {
      ...defaultField,
      nonCollapsedItems: 3
    };

    // when
    const { container } = createDynamicList({ field });

    // then
    const collapseButton = container.querySelector('.fjs-repeat-render-collapse');
    expect(collapseButton).to.not.exist;
  });


  it('should show add button when allowAddRemove is set', function() {

    // given
    const field = {
      ...defaultField,
      allowAddRemove: true
    };

    // when
    const { container } = createDynamicList({ field });

    // then
    const addButton = container.querySelector('.fjs-repeat-render-add');
    expect(addButton).to.exist;
  });


  it('should not show add button when allowAddRemove is not set', function() {

    // given
    const field = {
      ...defaultField,
      allowAddRemove: false
    };

    // when
    const { container } = createDynamicList({ field });

    // then
    const addButton = container.querySelector('.fjs-repeat-render-add');
    expect(addButton).to.not.exist;
  });


  it('should add new repetition when add button is clicked', async function() {

    // given
    const field = {
      ...defaultField,
      allowAddRemove: true
    };

    const onChangeSpy = sinon.spy();

    const { container } = createDynamicList({ field, onChange: onChangeSpy });
    const addButton = container.querySelector('.fjs-repeat-render-add');

    // when
    addButton.click();

    // then
    expect(onChangeSpy).to.have.been.calledWithMatch({
      field,
      value: [
        {
          creditor: 'John Doe',
          debitor: 'Jane Doe'
        },
        {
          creditor: 'John Doe 2',
          debitor: 'Jane Doe 2'
        },
        {
          creditor: null,
          debitor: null
        }
      ]
    });

  });


  it('should show remove button for each repetition when allowAddRemove is set', function() {

    // given
    const field = {
      ...defaultField,
      allowAddRemove: true
    };

    // when
    const { container } = createDynamicList({ field });

    // then
    const removeButtons = container.querySelectorAll('.fjs-repeat-row-remove');
    expect(removeButtons).to.have.length(2);
  });


  it('should not show remove button for each repetition when allowAddRemove is not set', function() {

    // given
    const field = {
      ...defaultField,
      allowAddRemove: false
    };

    // when
    const { container } = createDynamicList({ field });

    // then
    const removeButtons = container.querySelectorAll('.fjs-repeat-row-remove');
    expect(removeButtons).to.have.length(0);
  });


  it('should remove repetition when remove button is clicked', function() {

    // given
    const field = {
      ...defaultField,
      allowAddRemove: true
    };

    const onChangeSpy = sinon.spy();
    const { container } = createDynamicList({ field, onChange: onChangeSpy });
    const removeButtons = container.querySelectorAll('.fjs-repeat-row-remove');

    // when
    removeButtons[0].click();

    // then
    expect(onChangeSpy).to.have.been.calledWithMatch({
      field,
      value: [
        {
          creditor: 'John Doe 2',
          debitor: 'Jane Doe 2'
        }
      ]
    });
  });


  it('should have outline class when set', function() {

    // given
    const { container } = createDynamicList();
    const dynamicList = container.querySelector('.fjs-form-field-grouplike');

    // then
    expect(dynamicList.classList.contains('fjs-outlined')).to.be.true;
  });


  it('should not have outline class when unset', function() {

    // given
    const { container } = createDynamicList({ field: { ...defaultField, showOutline: false } });

    // then
    const dynamicList = container.querySelector('.fjs-form-field-grouplike');
    expect(dynamicList.classList.contains('fjs-outlined')).to.be.false;
  });


  it('#create', function() {

    // given
    const { config } = DynamicList;

    // then
    expect(config.type).to.eql('dynamiclist');
    expect(config.repeatable).to.be.true;
    expect(config.pathed).to.be.true;

    const field = config.create();
    expect(field).to.eql({
      components: [],
      showOutline: true,
      isRepeating: true,
      allowAddRemove: true,
      defaultRepetitions: 1
    });
  });


  describe('a11y', function() {
    it('should have no violations', async function() {
      this.timeout(10000);

      // when
      const { container } = createDynamicList();

      // then
      await expectNoViolations(container);
    });
  });
});

const defaultData = {
  dynamiclist: [
    {
      creditor: 'John Doe',
      debitor: 'Jane Doe'
    },
    {
      creditor: 'John Doe 2',
      debitor: 'Jane Doe 2'
    }
  ]
};

const defaultField = {
  id: 'DynamicList_1',
  label: 'Dynamic list',
  showOutline: true,
  isRepeating: true,
  allowAddRemove: true,
  defaultRepetitions: 1,
  path: 'dynamiclist',
  type: 'dynamiclist',
  components: [
    {
      id: 'Textfield_1',
      path: 'creditor',
      label: 'Creditor',
      type: 'textfield'
    },
    {
      id: 'Textfield_2',
      path: 'debitor',
      label: 'Debitor',
      type: 'textfield'
    }
  ]
};

function createDynamicList({ services, ...restOptions } = {}) {

  const options = {
    domId: 'test-dynamiclist',
    field: defaultField,
    initialData: defaultData,
    children: defaultField.components,
    data: defaultData,
    newFieldData: {
      creditor: null,
      debitor: null
    },
    onChange: () => {},
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <DynamicList
        field={ options.field }
        domId={ options.domId }
        onChange={ options.onChange } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}
