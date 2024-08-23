import { formFieldClasses } from '../Util';
import { Label } from '../Label';
import { Errors } from '../Errors';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useService, useSingleLineTemplateEvaluation } from '../../hooks';

const type = 'filepicker';

/**
 * @typedef Props
 * @property {(props: { value: string }) => void} onChange
 * @property {string} domId
 * @property {string[]} errors
 * @property {boolean} disabled
 * @property {boolean} readonly
 * @property {boolean} required
 * @property {Object} field
 * @property {string} field.id
 * @property {string} [field.label]
 * @property {string} [field.accept]
 * @property {boolean} [field.multiple]
 *
 * @param {Props} props
 * @returns {import("preact").JSX.Element}
 */
export function FilePicker(props) {
  /** @type {import("preact/hooks").Ref<HTMLInputElement>} */
  const fileInputRef = useRef(null);
  /** @type {[File[],import("preact/hooks").StateUpdater<File[]>]} */
  const [selectedFiles, setSelectedFiles] = useState([]);
  const eventBus = useService('eventBus');
  const { field, onChange, domId, errors = [], disabled, readonly, required } = props;
  const { label, multiple = '', accept = '', id } = field;
  const evaluatedAccept = useSingleLineTemplateEvaluation(accept);
  const evaluatedMultiple =
    useSingleLineTemplateEvaluation(typeof multiple === 'string' ? multiple : multiple.toString()) === 'true';
  const errorMessageId = `${domId}-error-message`;

  useEffect(() => {
    const reset = () => {
      setSelectedFiles([]);
      onChange({
        value: null,
      });
    };

    eventBus.on('import.done', reset);
    eventBus.on('reset', reset);

    return () => {
      eventBus.off('import.done', reset);
      eventBus.off('reset', reset);
    };
  }, [eventBus, onChange]);

  return (
    <div class={formFieldClasses(type, { errors, disabled, readonly })}>
      <Label htmlFor={domId} label={label} required={required} />
      <input
        type="file"
        className="fjs-hidden"
        ref={fileInputRef}
        id={domId}
        name={domId}
        multiple={evaluatedMultiple === false ? undefined : evaluatedMultiple}
        accept={evaluatedAccept === '' ? undefined : evaluatedAccept}
        onChange={(event) => {
          const input = /** @type {HTMLInputElement} */ (event.target);

          if (input.files === null || input.files.length === 0) {
            onChange({
              value: null,
            });
            return;
          }

          const files = Array.from(input.files);

          onChange({
            value: `${id}_value_key`,
          });

          setSelectedFiles(files);
        }}
      />
      <div className="fjs-filepicker-container">
        <button
          type="button"
          disabled={disabled}
          readonly={readonly}
          class="fjs-button"
          onClick={() => {
            fileInputRef.current.click();
          }}>
          Browse
        </button>
        <span className="fjs-form-field-label">{getSelectedFilesLabel(selectedFiles)}</span>
      </div>
      <Errors id={errorMessageId} errors={errors} />
    </div>
  );
}

FilePicker.config = {
  type: 'filepicker',
  keyed: true,
  label: 'File picker',
  group: 'basic-input',
  emptyValue: null,
  sanitizeValue: ({ value }) => {
    return value;
  },
  create: (options = {}) => ({ ...options }),
};

// helper //////////

/**
 * @param {File[]} files
 * @returns {string}
 */
function getSelectedFilesLabel(files) {
  if (files.length === 0) {
    return 'No files selected';
  }

  if (files.length === 1) {
    return files[0].name;
  }

  return `${files.length} files selected`;
}
