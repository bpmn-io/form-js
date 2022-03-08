import { useContext } from 'preact/hooks';

import { FormContext } from '../../context';
import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';
import { formFieldClasses, prefixId } from '../Util';

const type = 'file';

export default function File(props) {
  const { disabled = false, errors = [], field, value = '' } = props;

  const { description, id, label, validate = {} } = field;

  const { required } = validate;

  const onChange = async ({ target }) => {
    const base64Value = await convertBase64(target.files[0]);

    props.onChange({
      field,
      value: base64Value
    });

  };

  const onReset = () => {
    props.onChange({
      field,
      value: ''
    });
  };

  const onClick = () => {
    let newWindow = window.open('');
    newWindow.document.write(
      "<iframe width='100%' height='100%' src='" +
    value + "'></iframe>"
    );
  };

  const { formId } = useContext(FormContext);

  if (disabled === true && value)
    return <div class={ formFieldClasses(type, errors) }>
      <Label id={ prefixId(id, formId) } label={ label } required={ required } />
      <a onClick={ onClick }><button type="secondary" class="fjs-button">View/Download</button></a>
      <Description description={ description } />
    </div>;

  return (
    <div class={ formFieldClasses(type, errors) }>
      <Label id={ prefixId(id, formId) } label={ label } required={ required } />

      <input
        class="fjs-input"
        disabled={ disabled }
        id={ prefixId(id, formId) }
        onInput={ onChange }
        onReset={ onReset }
        type="file"
        value={ value }
      />
      <Description description={ description } />
      <Errors errors={ errors } />
    </div>

  );
}

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

File.create = function(options = {}) {
  return {
    ...options
  };
};

File.type = type;
File.label = 'File';
File.keyed = true;
File.emptyValue = '';
