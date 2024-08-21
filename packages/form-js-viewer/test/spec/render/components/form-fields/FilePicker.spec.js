import { fireEvent, render, screen } from '@testing-library/preact/pure';

import { FilePicker } from '../../../../../src/render/components/form-fields/FilePicker';

import { createFormContainer, expectNoViolations } from '../../../../TestHelper';

import { MockFormContext } from '../helper';

let container;

describe('FilePicker', function () {
  beforeEach(function () {
    container = createFormContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', function () {
    // when
    createFilePicker({
      field: {
        ...defaultField,
        label: 'My files',
      },
    });

    // then

    expect(screen.getByLabelText('My files')).to.exist;
    expect(screen.getByRole('button', { name: 'Browse' })).to.exist;
    expect(screen.getByText('No files selected')).to.exist;
  });

  it('should render errors', function () {
    // when
    createFilePicker({
      errors: ['Something went wrong'],
    });

    // then
    expect(screen.getByText('Something went wrong')).to.exist;
  });

  it('should change the label with single file selected', function () {
    // given
    const file = new File([''], 'test.png', { type: 'image/png' });
    const { container } = createFilePicker();

    // when

    fireEvent.change(container.querySelector('input[type="file"]'), {
      target: {
        files: [file],
      },
    });

    // then

    expect(screen.getByText('test.png')).to.exist;
  });

  it('should change the label with multiple files selected', function () {
    // given
    const file = new File([''], 'test1.png', { type: 'image/png' });
    const { container } = createFilePicker();

    // when

    fireEvent.change(container.querySelector('input[type="file"]'), {
      target: {
        files: [file, file],
      },
    });

    // then

    expect(screen.getByText('2 files selected')).to.exist;
  });

  it('should accept multiple files and limit the file types', function () {
    // when
    const { container } = createFilePicker({
      field: {
        ...defaultField,
        accept: 'image/*',
        multiple: true,
      },
    });

    // then

    expect(screen.getByRole('button', { name: 'Browse' })).to.exist;
    expect(screen.getByText('No files selected')).to.exist;
    expect(container.querySelector('input[type="file"]')).to.have.property('accept', 'image/*');
    expect(container.querySelector('input[type="file"]')).to.have.property('multiple');
  });

  it('should accept multiple files and limit the file types (expression)', function () {
    // when
    const { container } = createFilePicker({
      initialData: {
        mime: 'image/svg',
        acceptMultiple: true,
      },
      field: {
        ...defaultField,
        accept: '=mime',
        multiple: '=acceptMultiple',
      },
    });

    // then

    expect(screen.getByRole('button', { name: 'Browse' })).to.exist;
    expect(screen.getByText('No files selected')).to.exist;
    expect(container.querySelector('input[type="file"]')).to.have.property('accept', 'image/svg');
    expect(container.querySelector('input[type="file"]')).to.have.property('multiple');
  });

  it('#create', function () {
    // assume
    const { config } = FilePicker;

    // when
    const field = config.create();

    // then
    expect(field).to.eql({});

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
    it('should have no violations', async function () {
      // given
      this.timeout(10000);

      const { container } = createFilePicker();

      // then
      await expectNoViolations(container);
    });

    it('should have no violations for readonly', async function () {
      // given
      this.timeout(10000);

      const { container } = createFilePicker({
        value: true,
        readonly: true,
      });

      // then
      await expectNoViolations(container);
    });

    it('should have no violations for errors', async function () {
      // given
      this.timeout(10000);

      const { container } = createFilePicker({
        value: true,
        errors: ['Something went wrong'],
      });

      // then
      await expectNoViolations(container);
    });
  });
});

// helper //////////

const defaultField = {
  id: 'Filepicker_1',
  type: 'filepicker',
};

function createFilePicker({ services, ...restOptions } = {}) {
  const options = {
    domId: 'test-filepicker',
    field: defaultField,
    onChange: () => {},
    ...restOptions,
  };

  return render(
    <MockFormContext services={services} options={options}>
      <FilePicker
        disabled={options.disabled}
        readonly={options.readonly}
        errors={options.errors}
        domId={options.domId}
        field={options.field}
        onChange={options.onChange}
        onBlur={options.onBlur}
        value={options.value}
      />
    </MockFormContext>,
    {
      container: options.container || container.querySelector('.fjs-form'),
    },
  );
}
