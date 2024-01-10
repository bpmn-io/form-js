import {
  render
} from '@testing-library/preact/pure';

import { Group } from '../../../../../src/render/components/form-fields/Group';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { MockFormContext } from '../helper';

let container;

describe('Group', () => {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render with children', function() {

    // when
    const { container } = createGroup();

    // then
    const group = container.querySelector('.fjs-form-field');

    expect(group).to.exist;
    expect(group.classList.contains('fjs-form-field-group')).to.be.true;

    const groupLabel = group.querySelector('label');

    expect(groupLabel).to.exist;
    expect(groupLabel.textContent).to.equal('User Info');

    const textfields = group.querySelectorAll('.fjs-form-field-textfield');

    expect(textfields).to.have.length(2);

    const creditor = textfields[0];

    expect(creditor).to.exist;
    expect(creditor.querySelector('label').textContent).to.equal('Creditor');

    const debitor = textfields[1];

    expect(debitor).to.exist;
    expect(debitor.querySelector('label').textContent).to.equal('Debitor');
  });


  it('should render without children', function() {

    // when
    const { container } = createGroup({
      field: {
        id: 'Group_1',
        path: 'userInfo',
        label: 'User Info',
        type: 'group'
      },
      children: []
    });

    // then
    const group = container.querySelector('.fjs-form-field');

    expect(group).to.exist;
    expect(group.classList.contains('fjs-form-field-group')).to.be.true;

    const groupLabel = group.querySelector('label');

    expect(groupLabel).to.exist;
    expect(groupLabel.textContent).to.equal('User Info');

    const textfields = group.querySelectorAll('.fjs-form-field-textfield');

    expect(textfields).to.have.length(0);
  });


  it('should render with outline class when set', function() {

    // when
    const { container } = createGroup();

    // then
    const group = container.querySelector('.fjs-form-field');

    expect(group).to.exist;
    expect(group.classList.contains('fjs-form-field-group')).to.be.true;
    expect(group.classList.contains('fjs-outlined')).to.be.true;
  });


  it('should render without outline class when set', function() {

    // when
    const { container } = createGroup({ field: { ...defaultField, showOutline: false } });

    // then
    const group = container.querySelector('.fjs-form-field');

    expect(group).to.exist;
    expect(group.classList.contains('fjs-form-field-group')).to.be.true;
    expect(group.classList.contains('fjs-outlined')).to.be.false;
  });


  it('#create', function() {

    // assume
    const { config } = Group;
    expect(config.type).to.eql('group');
    expect(config.label).to.eql('Group');
    expect(config.group).to.eql('container');
    expect(config.pathed).to.be.true;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({
      components: [],
      showOutline: true
    });

    // but when
    const customField = config.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      showOutline: true,
      custom: true
    });

    expect(customField.components).to.be.empty;
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(10000);

      const { container } = createGroup();

      // then
      await expectNoViolations(container);
    });

  });

});

const defaultField = {
  id: 'Group_1',
  path: 'userInfo',
  label: 'User Info',
  showOutline: true,
  type: 'group',
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

function createGroup({ services, ...restOptions } = {}) {

  const options = {
    domId: 'test-group',
    field: defaultField,
    children: defaultField.components,
    container,
    ...restOptions
  };

  return render(
    <MockFormContext
      services={ services }
      options={ options }>
      <Group
        domId={ options.domId }
        field={ options.field } />
    </MockFormContext>, {
      container: options.container || container.querySelector('.fjs-form')
    }
  );
}
