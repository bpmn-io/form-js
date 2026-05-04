import { render, screen } from '@testing-library/preact/pure';
import userEvent from '@testing-library/user-event';
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

    expect(screen.queryByText('Document reference is not defined.')).to.exist;
  });

  it('should handle missing data source', function () {
    // when
    const { container } = createDocumentPreview({
      initialData: {},
      services: {
        expressionLanguage: mockExpressionLanguageService,
      },
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-documentPreview')).to.be.true;
  });

  it('should handle null documents in data source', function () {
    // given
    const documentsWithNull = [
      null,
      {
        documentId: 'document0',
        endpoint: 'https://pub-280be5f41fe1419e8d236b586696129e.r2.dev/document0',
        metadata: {
          fileName: 'My document.txt',
          contentType: 'text/plain',
        },
      },
    ];

    // when
    const { container } = createDocumentPreview({
      initialData: {
        documents: documentsWithNull,
      },
      services: {
        expressionLanguage: mockExpressionLanguageService,
      },
    });

    // then
    const formField = container.querySelector('.fjs-form-field');
    expect(formField).to.exist;

    expect(screen.getAllByRole('button')).to.have.length(1);
    expect(screen.getByText('My document.txt')).to.exist;
  });

  it('should accept a custom endpoint builder', async function () {
    // given
    const mockDocumentEndpointBuilder = {
      buildUrl: sinon.spy((document) => `${document.endpoint}/transformed`),
    };
    const mockDocument = {
      documentId: 'document0',
      endpoint: 'https://pub-280be5f41fe1419e8d236b586696129e.r2.dev/document0',
      metadata: {
        fileName: 'My document.png',
        contentType: 'image/png',
      },
    };

    const { container } = createDocumentPreview({
      initialData: {
        documents: [mockDocument],
      },
      services: {
        expressionLanguage: mockExpressionLanguageService,
        documentEndpointBuilder: mockDocumentEndpointBuilder,
      },
    });

    // then
    const formField = container.querySelector('.fjs-form-field');
    expect(formField).to.exist;
    expect(mockDocumentEndpointBuilder.buildUrl).to.have.been.calledWith(mockDocument);
  });

  it('should pass custom request config to document fetch', async function () {
    // given
    const requestInit = {
      headers: {
        authorization: 'Bearer token',
      },
      credentials: 'include',
    };
    const mockDocument = {
      documentId: 'document0',
      endpoint: 'https://pub-280be5f41fe1419e8d236b586696129e.r2.dev/document0',
      metadata: {
        fileName: 'My document.png',
        contentType: 'image/png',
      },
    };
    const mockDocumentEndpointBuilder = {
      buildRequestInit: sinon.stub().returns(requestInit),
    };
    const fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false });

    try {
      createDocumentPreview({
        initialData: {
          documents: [mockDocument],
        },
        services: {
          expressionLanguage: mockExpressionLanguageService,
          documentEndpointBuilder: mockDocumentEndpointBuilder,
        },
      });

      // when
      await userEvent.click(screen.getByRole('button', { name: 'Download My document.png' }));

      // then
      expect(fetchStub).to.have.been.calledWith(mockDocument.endpoint, requestInit);
      expect(mockDocumentEndpointBuilder.buildRequestInit).to.have.been.calledWith(mockDocument);
    } finally {
      fetchStub.restore();
    }
  });

  it('should fallback to default fetch config if request config builder throws', async function () {
    // given
    const mockDocument = {
      documentId: 'document0',
      endpoint: 'https://pub-280be5f41fe1419e8d236b586696129e.r2.dev/document0',
      metadata: {
        fileName: 'My document.png',
        contentType: 'image/png',
      },
    };
    const mockDocumentEndpointBuilder = {
      buildRequestInit: sinon.stub().throws(new Error('request init build failed')),
    };
    const fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false });
    const errorStub = sinon.stub(console, 'error');

    try {
      createDocumentPreview({
        initialData: {
          documents: [mockDocument],
        },
        services: {
          expressionLanguage: mockExpressionLanguageService,
          documentEndpointBuilder: mockDocumentEndpointBuilder,
        },
      });

      // when
      await userEvent.click(screen.getByRole('button', { name: 'Download My document.png' }));

      // then
      expect(fetchStub).to.have.been.calledWith(mockDocument.endpoint, undefined);
    } finally {
      fetchStub.restore();
      errorStub.restore();
    }
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

    // then
    expect(field).to.eql({
      label: 'Document preview',
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
  id: 'myDocument',
  label: 'Document preview',
};

const initialData = {
  documents: [
    {
      documentId: 'document0',
      endpoint: 'https://pub-280be5f41fe1419e8d236b586696129e.r2.dev/document0',
      metadata: {
        fileName: 'My document.pdf',
        contentType: 'application/pdf',
      },
    },
    {
      documentId: 'document1',
      endpoint: 'https://pub-280be5f41fe1419e8d236b586696129e.r2.dev/document1',
      metadata: {
        fileName: 'My document.png',
        contentType: 'image/png',
      },
    },
    {
      documentId: 'document2',
      endpoint: 'https://pub-280be5f41fe1419e8d236b586696129e.r2.dev/document2',
      metadata: {
        fileName: 'My document.zip',
        contentType: 'application/zip',
      },
    },
  ],
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
