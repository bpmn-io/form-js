import Ids from 'ids';
import { formFieldClasses } from '../Util';
import { Label } from '../Label';
import { Errors } from '../Errors';
import { useEffect, useRef } from 'preact/hooks';
import { useService, useSingleLineTemplateEvaluation, useBooleanExpressionEvaluation } from '../../hooks';
import { FILE_PICKER_FILE_KEY_PREFIX } from '../../../util/constants/FilePickerConstants';

const type = 'filepicker';
const ids = new Ids();
const EMPTY_ARRAY = [];

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
 * @property {string|boolean} [field.multiple]
 * @property {string} [value]
 *
 * @param {Props} props
 * @returns {import("preact").JSX.Element}
 */
export function FilePicker(props) {
  /** @type {import("preact/hooks").Ref<HTMLInputElement>} */
  const fileInputRef = useRef(null);
  /** @type {import('../../FileRegistry').FileRegistry} */
  const fileRegistry = useService('fileRegistry', false);
  const { field, onChange, domId, errors = [], disabled, readonly, required, value: filesKey = '' } = props;
  const { label, multiple = false, accept = '' } = field;
  const evaluatedAccept = useSingleLineTemplateEvaluation(accept);
  const evaluatedMultiple = useBooleanExpressionEvaluation(multiple);
  const errorMessageId = `${domId}-error-message`;
  const selectedFiles = fileRegistry === null ? EMPTY_ARRAY : fileRegistry.getFiles(filesKey);

  useEffect(() => {
    const data = new DataTransfer();
    selectedFiles.forEach((file) => data.items.add(file));
    fileInputRef.current.files = data.files;
  }, [selectedFiles]);

  const onFileChange = (event) => {
    const input = /** @type {HTMLInputElement} */ (event.target);

    // if we have an associated file key but no files are selected, clear the file key and associated files
    if ((input.files === null || input.files.length === 0) && filesKey !== '') {
      fileRegistry.deleteFiles(filesKey);
      onChange({ value: null });
      return;
    }

    const files = Array.from(input.files);

    // ensure fileKey exists
    const _filesKey = filesKey || ids.nextPrefixed(FILE_PICKER_FILE_KEY_PREFIX);
    fileRegistry.setFiles(_filesKey, files);
    onChange({ value: _filesKey });
  };

  return (
    <div className={formFieldClasses(type, { errors, disabled, readonly })}>
      <Label htmlFor={domId} label={label} required={required} />
      <input
        type="file"
        className="fjs-hidden"
        ref={fileInputRef}
        id={domId}
        name={domId}
        multiple={evaluatedMultiple || undefined}
        accept={evaluatedAccept || undefined}
        onChange={onFileChange}
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
