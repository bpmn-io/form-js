import {
  NumberInputEntry,
  SelectEntry,
  TextInputEntry
} from '../components';

export default function DefaultValueEntry(props) {
  const {
    editField,
    field
  } = props;

  const {
    defaultValue,
    type,
    values = []
  } = field;

  if (type === 'checkbox') {
    const options = [
      {
        label: '<none>'
      },
      {
        label: 'Checked',
        value: 'true'
      },
      {
        label: 'Not checked',
        value: 'false'
      }
    ];

    const onChange = (value) => {
      editField(field, [ 'defaultValue' ], parseBoolean(value));
    };

    return (
      <SelectEntry
        id="defaultValue"
        label="Default Value"
        onChange={ onChange }
        options={ options }
        value={ parseString(defaultValue) } />
    );
  }

  if (type === 'number') {
    return (
      <NumberInputEntry
        editField={ editField }
        field={ field }
        id="defaultValue"
        label="Default Value"
        path={ [ 'defaultValue' ] } />
    );
  }

  if (type === 'radio' || type === 'select') {
    const options = [
      {
        label: '<none>'
      },
      ...values
    ];

    const onChange = (value) => {
      editField(field, [ 'defaultValue' ], value.length ? value : undefined);
    };

    return (
      <SelectEntry
        id="defaultValue"
        label="Default Value"
        onChange={ onChange }
        options={ options }
        value={ defaultValue } />
    );
  }

  if (type === 'textfield') {
    return (
      <TextInputEntry
        editField={ editField }
        field={ field }
        id="defaultValue"
        label="Default Value"
        path={ [ 'defaultValue' ] } />
    );
  }
}

function parseBoolean(value) {
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }

  return undefined;
}

function parseString(value) {
  if (value === true) {
    return 'true';
  } else if (value === false) {
    return 'false';
  }

  return '';
}