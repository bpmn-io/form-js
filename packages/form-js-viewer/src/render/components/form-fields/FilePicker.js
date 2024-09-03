import { formFieldClasses } from '../Util';
import { Label } from '../Label';
import { Errors } from '../Errors';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useService, useSingleLineTemplateEvaluation } from '../../hooks';
import { valuePathArrayToString } from '../../../util/objectPath';
import { FILE_PICKER_FILE_KEY_PREFIX } from '../../../util/constants/FilePickerConstants';

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
 * @property {Object} fieldInstance
 * @property {(string|number)[]} fieldInstance.valuePath
 *
 * @param {Props} props
 * @returns {import("preact").JSX.Element}
 */
export function FilePicker(props) {
  /** @type {import("preact/hooks").Ref<HTMLInputElement>} */
  const fileInputRef = useRef(null);
  /** @type {[File[], import("preact/hooks").StateUpdater<File[]>]} */
  const [selectedFiles, setSelectedFiles] = useState([]);
  /** @type {import('diagram-js/lib/core/EventBus').default} */
  const eventBus = useService('eventBus');
  /** @type {import('../../FileRegistry').FileRegistry} */
  const fileRegistry = useService('fileRegistry', false);
  const { field, onChange, domId, errors = [], disabled, readonly, required, fieldInstance } = props;
  const { label, multiple = '', accept = '' } = field;
  const { valuePath = [] } = fieldInstance;
  const evaluatedAccept = useSingleLineTemplateEvaluation(accept);
  const evaluatedMultiple =
    useSingleLineTemplateEvaluation(typeof multiple === 'string' ? multiple : multiple.toString()) === 'true';
  const errorMessageId = `${domId}-error-message`;
  const filesKey = `${FILE_PICKER_FILE_KEY_PREFIX}${valuePathArrayToString(valuePath)}`;

  useEffect(() => {
    function reset() {
      setSelectedFiles([]);

      if (fileRegistry) {
        fileRegistry.deleteFiles(filesKey);
      }

      onChange({
        value: null,
      });
    }

    eventBus.on('import.done', reset);
    eventBus.on('reset', reset);

    return () => {
      eventBus.off('import.done', reset);
      eventBus.off('reset', reset);
    };
  }, [eventBus, onChange, fileRegistry, filesKey]);

  return (
    <div className={formFieldClasses(type, { errors, disabled, readonly })}>
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
            fileRegistry.deleteFiles(filesKey);
            setSelectedFiles([]);

            return;
          }

          const files = Array.from(input.files);

          onChange({
            value: filesKey,
          });

          fileRegistry.setFiles(filesKey, files);

          setSelectedFiles(files);
        }}
      />
      <div className="fjs-filepicker-container">
        <button
          type="button"
          disabled={disabled || readonly || fileRegistry === null}
          readonly={readonly}
          className="fjs-button"
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
