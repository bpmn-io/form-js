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
        label: 'Checked',
        value: 'true'
      },
      {
        label: 'Not checked',
        value: 'false'
      }
    ];

    const onChange = (value) => {
      editField(field, [ 'defaultValue' ], parseStringToBoolean(value));
    };

    return (
      <SelectEntry
        id="defaultValue"
        label="Default Value"
        onChange={ onChange }
        options={ options }
        value={ parseBooleanToString(defaultValue) } />
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

function parseStringToBoolean(value) {
  if (value === 'true') {
    return true;
  }

  return false;
}

function parseBooleanToString(value) {
  if (value === true) {
    return 'true';
  }

  return 'false';
}