import classNames from 'classnames';
import { useExpressionEvaluation, useSingleLineTemplateEvaluation, useService } from '../../hooks';
import { Errors } from '../Errors';
import { formFieldClasses } from '../Util';
import { isString } from 'min-dash';
import DownloadIcon from './icons/Download.svg';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Label } from '../Label';

const type = 'documentPreview';

/**
 * @typedef DocumentEndpointBuilder
 * @property {(document: DocumentMetadata) => string} buildUrl
 */

/**
 * @typedef DocumentMetadata
 * @property {string} documentId
 * @property {string} endpoint
 * @property {Object} metadata
 * @property {string|undefined} [metadata.contentType]
 * @property {string} metadata.fileName
 *
 * @typedef Field
 * @property {string} id
 * @property {string} [title]
 * @property {string} [dataSource]
 * @property {string} [endpointKey]
 * @property {number} [maxHeight]
 * @property {string} [label]
 *
 * @typedef Props
 * @property {Field} field
 * @property {string} domId
 *
 * @param {Props} props
 * @returns {import("preact").JSX.Element}
 */
export function DocumentPreview(props) {
  /** @type {DocumentEndpointBuilder | null} */
  const documentEndpointBuilder = useService('documentEndpointBuilder', false);
  const { field, domId } = props;
  const { dataSource, maxHeight, label } = field;
  const errorMessageId = `${domId}-error-message`;
  const data = useValidDocumentData(dataSource || '');
  const evaluatedLabel = useSingleLineTemplateEvaluation(label, { debug: true });

  return (
    <div class={formFieldClasses(type)}>
      <Label htmlFor={domId} label={evaluatedLabel} />
      <div class={`fjs-${type}-document-container`} id={domId}>
        {data.map((document, index) => {
          const finalEndpoint = tryCatch(() => documentEndpointBuilder?.buildUrl(document)) ?? document.endpoint;

          return isValidDocumentEndpoint(finalEndpoint) ? (
            <DocumentRenderer
              key={document.documentId}
              documentMetadata={document}
              endpoint={finalEndpoint}
              maxHeight={maxHeight}
              domId={`${domId}-${index}`}
            />
          ) : null;
        })}
      </div>

      <Errors
        id={errorMessageId}
        errors={getErrors({
          dataSource,
        })}
      />
    </div>
  );
}

DocumentPreview.config = {
  type,
  keyed: false,
  group: 'presentation',
  name: 'Document preview',
  create: (options = {}) => ({
    label: 'Document preview',
    ...options,
  }),
};

// helpers /////////////////////////////

/**
 * @typedef GetErrorOptions
 * @property {string|undefined} dataSource
 *
 * @param {GetErrorOptions} options
 * @returns {string[]}
 */
function getErrors(options) {
  const { dataSource } = options;
  let errors = [];

  if (!isString(dataSource) || dataSource.length < 1) {
    errors.push('Document reference is not defined.');
  }

  return errors;
}

/**
 *
 * @param {unknown} endpoint
 * @returns boolean
 */
function isValidDocumentEndpoint(endpoint) {
  return typeof endpoint === 'string' && URL.canParse(endpoint);
}

/**
 * @param {unknown} document
 * @returns {metadata is DocumentMetadata}
 */
function isValidDocument(document) {
  return (
    typeof document === 'object' &&
    document !== null &&
    'documentId' in document &&
    'metadata' in document &&
    typeof document.metadata === 'object' &&
    'fileName' in document.metadata
  );
}

/**
 * @param {string} dataSource
 * @returns {DocumentMetadata[]}
 */
function useValidDocumentData(dataSource) {
  const data = useExpressionEvaluation(dataSource);

  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(isValidDocument);
}

/**
 * @param {Object} props
 * @param {string} props.url
 * @param {string} props.fileName
 * @param {Function} props.onError
 * @param {string} props.errorMessageId
 * @returns {import("preact").JSX.Element}
 */
function PdfRenderer(props) {
  const { url, onError, errorMessageId } = props;
  /** @type {ReturnType<typeof import("preact/hooks").useState<null | string>>} */
  const [pdfObjectUrl, setPdfObjectUrl] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    /** @type {null | string} */
    let objectUrl = null;

    const fetchPdf = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          setHasError(true);
          onError();
          return;
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfObjectUrl(objectUrl);
      } catch {
        setHasError(true);
        onError();
      }
    };

    fetchPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url, onError]);

  return (
    <>
      {pdfObjectUrl !== null ? (
        <embed src={pdfObjectUrl} type="application/pdf" class={`fjs-${type}-pdf-viewer`} />
      ) : null}
      {hasError ? <Errors id={errorMessageId} errors={['Unable to download document']} /> : null}
    </>
  );
}

/**
 *
 * @param {Object} props
 * @param {DocumentMetadata} props.documentMetadata
 * @param {string} props.endpoint
 * @param {string} props.domId
 * @param {number|undefined} props.maxHeight
 *
 * @returns {import("preact").JSX.Element}
 */
function DocumentRenderer(props) {
  const { documentMetadata, endpoint, maxHeight, domId } = props;
  const { metadata } = documentMetadata;
  const [hasError, setHasError] = useState(false);
  const ref = useRef(null);
  const isInViewport = useInViewport(ref);
  const singleDocumentContainerClassName = `fjs-${type}-single-document-container`;
  const errorMessageId = `${domId}-error-message`;
  const errorMessage = 'Unable to download document';
  const isContentTypePresent = typeof metadata.contentType === 'string';

  if (isContentTypePresent && metadata.contentType.toLowerCase().startsWith('image/') && isInViewport) {
    return (
      <div
        class={singleDocumentContainerClassName}
        style={{ maxHeight }}
        aria-describedby={hasError ? errorMessageId : undefined}>
        <img src={endpoint} alt={metadata.fileName} class={`fjs-${type}-image`} />
        <DownloadButton
          endpoint={endpoint}
          fileName={metadata.fileName}
          onDownloadError={() => {
            setHasError(true);
          }}
        />
        {hasError ? <Errors id={errorMessageId} errors={[errorMessage]} /> : null}
      </div>
    );
  }

  if (isContentTypePresent && metadata.contentType.toLowerCase() === 'application/pdf' && isInViewport) {
    return (
      <div
        class={singleDocumentContainerClassName}
        style={{ maxHeight }}
        aria-describedby={hasError ? errorMessageId : undefined}>
        <PdfRenderer
          url={endpoint}
          fileName={metadata.fileName}
          onError={() => setHasError(true)}
          errorMessageId={errorMessageId}
        />
      </div>
    );
  }

  return (
    <div
      class={classNames(`fjs-${type}-non-preview-item`, `fjs-${type}-single-document-container`)}
      ref={ref}
      aria-describedby={hasError ? errorMessageId : undefined}>
      <div>
        <div class="fjs-document-preview-title">{metadata.fileName}</div>
        {hasError ? <Errors id={errorMessageId} errors={[errorMessage]} /> : null}
      </div>
      <DownloadButton
        endpoint={endpoint}
        fileName={metadata.fileName}
        onDownloadError={() => {
          setHasError(true);
        }}
      />
    </div>
  );
}

/**
 * @param {Object} props
 * @param {string} props.endpoint
 * @param {string} props.fileName
 * @param {Function} props.onDownloadError
 *
 * @returns {import("preact").JSX.Element}
 */
function DownloadButton(props) {
  const { endpoint, fileName, onDownloadError } = props;

  const handleDownload = async () => {
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        onDownloadError();
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      onDownloadError();
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      class={classNames(`fjs-${type}-download-button`)}
      aria-label={`Download ${fileName}`}>
      <DownloadIcon />
    </button>
  );
}

/**
 *
 * @param {import("preact").RefObject<HTMLElement|null>} ref
 * @returns boolean
 */
function useInViewport(ref) {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const container = ref.current;

    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
        }
      },
      {
        threshold: 0,
      },
    );

    observer.observe(container);

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [ref]);

  return isInViewport;
}

/**
 * @template T
 * @param {() => T} fn - Function to execute
 * @returns {T | null}
 */
const tryCatch = (fn) => {
  try {
    return fn();
  } catch (error) {
    console.error(error);
    return null;
  }
};
