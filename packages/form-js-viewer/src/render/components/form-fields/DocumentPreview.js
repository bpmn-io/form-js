import classNames from 'classnames';
import { useExpressionEvaluation, useSingleLineTemplateEvaluation } from '../../hooks';
import { Errors } from '../Errors';
import { formFieldClasses } from '../Util';
import { isString } from 'min-dash';
import DownloadIcon from './icons/Download.svg';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Label } from '../Label';

const type = 'documentPreview';

/**
 * @typedef DocumentMetadata
 * @property {string} documentId
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
  const { field, domId } = props;
  const { dataSource, endpointKey, maxHeight, label } = field;
  const errorMessageId = `${domId}-error-message`;
  const endpoint = useExpressionEvaluation(endpointKey || '');
  const data = useValidDocumentData(dataSource || '');
  const evaluatedLabel = useSingleLineTemplateEvaluation(label, { debug: true });

  return (
    <div class={formFieldClasses(type)}>
      <Label htmlFor={domId} label={evaluatedLabel} />
      <div class={`fjs-${type}-document-container`} id={domId}>
        {isValidDocumentEndpoint(endpoint)
          ? data.map((document, index) => (
              <DocumentRenderer
                key={document.documentId}
                documentMetadata={document}
                endpoint={endpoint}
                maxHeight={maxHeight}
                domId={`${domId}-${index}`}
              />
            ))
          : null}
      </div>

      <Errors
        id={errorMessageId}
        errors={getErrors({
          dataSource,
          endpoint,
          endpointKey,
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
    endpointKey: '=defaultDocumentsEndpointKey',
    ...options,
  }),
};

// helpers /////////////////////////////

const DOCUMENT_ID_PLACEHOLDER = '{documentId}';

/**
 * @typedef GetErrorOptions
 * @property {string|undefined} dataSource
 * @property {string|undefined} endpointKey
 * @property {string|null} endpoint
 *
 * @param {GetErrorOptions} options
 * @returns {string[]}
 */
function getErrors(options) {
  const { dataSource, endpointKey, endpoint } = options;
  let errors = [];

  if (!isString(dataSource) || dataSource.length < 1) {
    errors.push('Data source is not defined.');
  }

  if (!isString(endpointKey) || endpointKey.length < 1) {
    errors.push('Endpoint key is not defined.');
  }

  if (!URL.canParse(endpoint)) {
    errors.push('Endpoint is not valid.');
  } else if (!isValidDocumentEndpoint(endpoint)) {
    errors.push('Endpoint must contain "{documentId}".');
  }

  return errors;
}

/**
 *
 * @param {unknown} endpoint
 * @returns boolean
 */
function isValidDocumentEndpoint(endpoint) {
  return typeof endpoint === 'string' && URL.canParse(endpoint) && endpoint.includes(DOCUMENT_ID_PLACEHOLDER);
}

/**
 * @param {unknown} document
 * @returns {metadata is DocumentMetadata}
 */
function isValidDocument(document) {
  return (
    typeof document === 'object' &&
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
  const fullUrl = endpoint.replace(DOCUMENT_ID_PLACEHOLDER, documentMetadata.documentId);
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
        <img src={fullUrl} alt={metadata.fileName} class={`fjs-${type}-image`} />
        <DownloadButton
          endpoint={fullUrl}
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
        <embed src={fullUrl} type="application/pdf" class={`fjs-${type}-pdf-viewer`} />
        {hasError ? <Errors id={errorMessageId} errors={[errorMessage]} /> : null}
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
        endpoint={fullUrl}
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
 * @param {import("preact").RefObject<HTMLElement>} ref
 * @returns boolean
 */
function useInViewport(ref) {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isInViewport;
}
