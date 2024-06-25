import { render } from '@testing-library/preact/pure';

import { Button } from '../../../../../src/render/components/form-fields/Button';

import { createFormContainer, expectNoViolations } from '../../../../TestHelper';

import { MockFormContext } from '../helper';

let container;

describe('Button', function () {
  beforeEach(function () {
    container = createFormContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', function () {
    // when
    const { container } = createButton({
      field: {
        ...defaultField,
        action: 'reset',
        label: 'Reset',
      },
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-button')).to.be.true;

    const button = container.querySelector('button');

    expect(button).to.exist;
    expect(button.type).to.equal('reset');
    expect(button.textContent).to.equal('Reset');
  });

  it('should render with expression label', function () {
    // when
    const { container } = createButton({
      initialData: {
        foo: '42 labels',
      },
      field: {
        ...defaultField,
        label: '=foo',
      },
    });

    // then
    const button = container.querySelector('button');

    expect(button).to.exist;
    expect(button.textContent).to.equal('42 labels');
  });

  it('should render with templated label', function () {
    // when
    const { container } = createButton({
      initialData: {
        foo: '42',
      },
      field: {
        ...defaultField,
        label: 'My label {{foo}}',
      },
    });

    // then
    const button = container.querySelector('button');

    expect(button).to.exist;
    expect(button.textContent).to.equal('My label 42');
  });

  it('should render with default type (submit)', function () {
    // when
    const { container } = createButton();

    // then
    const button = container.querySelector('button');

    expect(button).to.exist;
    expect(button.type).to.equal('submit');
  });

  it('should render disabled', function () {
    // when
    const { container } = createButton({
      disabled: true,
    });

    // then
    const button = container.querySelector('button');

    expect(button).to.exist;
    expect(button.disabled).to.be.true;
  });

  it('#create', function () {
    // assume
    const { config } = Button;
    expect(config.type).to.eql('button');
    expect(config.label).to.eql('Button');
    expect(config.group).to.eql('action');
    expect(config.keyed).to.be.false;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({
      action: 'submit',
    });

    // but when
    const customField = config.create({
      custom: true,
    });

    // then
    expect(customField).to.contain({
      custom: true,
    });
  });

  describe('a11y', function () {
    it('should have no violations - submit', async function () {
      // given
      this.timeout(10000);

      const { container } = createButton({
        field: {
          ...defaultField,
          action: 'submit',
          label: 'Submit',
        },
      });

      // then
      await expectNoViolations(container);
    });

    it('should have no violations - reset', async function () {
      // given
      this.timeout(10000);

      const { container } = createButton({
        field: {
          ...defaultField,
          action: 'reset',
          label: 'Reset',
        },
      });

      // then
      await expectNoViolations(container);
    });
  });
});

// helpers //////////

const defaultField = {
  key: 'submit',
  label: 'Submit',
  type: 'button',
};

function createButton({ services, ...restOptions } = {}) {
  const options = {
    field: defaultField,
    ...restOptions,
  };

  return render(
    <MockFormContext services={services} options={options}>
      <Button {...options} />
    </MockFormContext>,
    {
      container: options.container || container.querySelector('.fjs-form'),
    },
  );
}
