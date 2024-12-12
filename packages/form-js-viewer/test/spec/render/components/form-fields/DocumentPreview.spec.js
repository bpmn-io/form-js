import { render, screen } from '@testing-library/preact/pure';
import { createFormContainer, expectNoViolations } from '../../../../TestHelper';
import { MockFormContext } from '../helper';
import { DocumentPreview } from '../../../../../src/render/components/form-fields/DocumentPreview';

let container;

describe('DocumentPreview', function () {
  beforeEach(function () {
    container = createFormContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', async function () {
    // when
    const { container } = createDocumentPreview({
      initialData,
      services: {
        expressionLanguage: mockExpressionLanguageService,
      },
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-documentPreview')).to.be.true;

    expect(screen.getByText('Document preview')).to.exist;
    expect(screen.getByRole('button', { name: 'Download My document.pdf' })).to.exist;
    expect(screen.getByRole('button', { name: 'Download My document.png' })).to.exist;
    expect(screen.getByRole('button', { name: 'Download My document.zip' })).to.exist;
    expect(screen.getByText('My document.pdf')).to.exist;
    expect(screen.getByText('My document.png')).to.exist;
    expect(screen.getByText('My document.zip')).to.exist;
  });

  it('should handle invalid endpoint value', function () {
    // when
    const { container } = createDocumentPreview({
      initialData: {
        defaultDocumentsEndpointKey: false,
      },
      services: {
        expressionLanguage: mockExpressionLanguageService,
      },
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-documentPreview')).to.be.true;

    expect(screen.queryByText('Endpoint is not valid.')).to.exist;
  });

  it('should handle bad endpoint format', function () {
    // when
    const { container } = createDocumentPreview({
      initialData,
      field: {
        ...defaultField,
        dataSource: undefined,
      },
      services: {
        expressionLanguage: mockExpressionLanguageService,
      },
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-documentPreview')).to.be.true;

    expect(screen.queryByText('Data source is not defined.')).to.exist;
  });

  it('should handle missing endpoint', function () {
    // when
    const { container } = createDocumentPreview({
      initialData,
      field: {
        ...defaultField,
        endpointKey: undefined,
      },
      services: {
        expressionLanguage: mockExpressionLanguageService,
      },
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-documentPreview')).to.be.true;

    expect(screen.queryByText('Endpoint key is not defined.')).to.exist;
    expect(screen.queryByText('Endpoint is not valid.')).to.exist;
  });

  it('should handle missing data source', function () {
    // when
    const { container } = createDocumentPreview({
      initialData: {
        defaultDocumentsEndpointKey: 'https://pub-280be5f41fe1419e8d236b586696129e.r2.dev/{documentId}',
      },
      services: {
        expressionLanguage: mockExpressionLanguageService,
      },
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-documentPreview')).to.be.true;
  });

  it('#create', function () {
    // assume
    const { config } = DocumentPreview;
    expect(config.type).to.eql('documentPreview');
    expect(config.name).to.eql('Document preview');
    expect(config.group).to.eql('presentation');
    expect(config.keyed).to.be.false;

    // when
    const field = config.create();

    console.log({ field });

    // then
    expect(field).to.eql({
      label: 'Document preview',
      endpointKey: '=defaultDocumentsEndpointKey',
    });

    // but when
    const customField = config.create({
      custom: true,
      endpointKey: '=foobar',
    });

    // then
    expect(customField).to.contain({
      custom: true,
      endpointKey: '=foobar',
    });
  });

  describe('a11y', function () {
    it('should have no violations', async function () {
      // given
      this.timeout(10000);

      const { container } = createDocumentPreview({
        initialData,
        services: {
          expressionLanguage: mockExpressionLanguageService,
        },
      });

      // then
      await expectNoViolations(container);
    });

    it('should have no violations - security attributes', async function () {
      // given
      this.timeout(5000);

      const { container } = createDocumentPreview({
        initialData,
        services: {
          expressionLanguage: mockExpressionLanguageService,
        },
      });

      // then
      await expectNoViolations(container);
    });
  });
});

// helpers //////////

const defaultField = {
  title: 'Document preview',
  type: 'documentPreview',
  dataSource: '=documents',
  endpointKey: '=defaultDocumentsEndpointKey',
  id: 'myDocument',
  label: 'Document preview',
};

const initialData = {
  documents: [
    {
      documentId: 'document0',
      metadata: {
        fileName: 'My document.pdf',
        contentType: 'application/pdf',
      },
    },
    {
      documentId: 'document1',
      metadata: {
        fileName: 'My document.png',
        contentType: 'image/png',
      },
    },
    {
      documentId: 'document2',
      metadata: {
        fileName: 'My document.zip',
        contentType: 'application/zip',
      },
    },
  ],
  defaultDocumentsEndpointKey: 'https://pub-280be5f41fe1419e8d236b586696129e.r2.dev/{documentId}',
};

const mockExpressionLanguageService = {
  isExpression: () => true,
  evaluate: (expression, context) => {
    return context[expression.replace('=', '')];
  },
};

function createDocumentPreview({ services, ...restOptions } = {}) {
  const options = {
    domId: 'test-documentPreview',
    field: defaultField,
    container,
    ...restOptions,
  };

  return render(
    <MockFormContext services={services} options={options}>
      <DocumentPreview domId={options.domId} field={options.field} />
    </MockFormContext>,
    {
      container: options.container || container.querySelector('.fjs-form'),
    },
  );
}
