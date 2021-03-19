import { useCallback, useMemo, useState } from 'preact/hooks';

import { debounce } from 'min-dash';

import { DefaultRenderer } from '@bpmn-io/form-js-viewer';

import {
  get,
  set
} from 'min-dash';

import { iconsByType } from './icons';

import ChevronIcon from './icons/Chevron.svg';

const labelsByType = {
  button: 'BUTTON',
  checkbox: 'CHECKBOX',
  columns: 'COLUMNS',
  number: 'NUMBER',
  textfield: 'TEXT FIELD'
};

const FIELDS = [
  'checkbox',
  'number',
  'radio',
  'textfield'
];

function Checkbox(props) {
  const {
    label,
    value,
    onChange,
    ...rest
  } = props;

  const handleChange = ({ target }) => {
    onChange(target.checked);
  };

  return (
    <div class="fjs-properties-panel-textfield">
      <label class="fjs-properties-panel-label">{ label }</label>
      <input type="checkbox" class="fjs-properties-panel-input" onChange={ handleChange } checked={ value } { ...rest } />
    </div>
  );
}

function Textfield(props) {
  const {
    label,
    value
  } = props;

  const debouncedOnInput = useCallback(debounce(props.onInput, 300), [ props.onInput ]);

  const onInput = ({ target }) => {
    debouncedOnInput(target.value);
  };

  return (
    <div class="fjs-properties-panel-textfield">
      <label class="fjs-properties-panel-label">{ label }</label>
      <input type="text" spellCheck="false" class="fjs-properties-panel-input" onInput={ onInput } value={ value || '' } />
    </div>
  );
}

function Number(props) {
  const {
    label,
    value,
    onInput,
    ...rest
  } = props;

  const handleInput = ({ target }) => {
    onInput(target.value);
  };

  return (
    <div class="fjs-properties-panel-textfield">
      <label class="fjs-properties-panel-label">{ label }</label>
      <input type="number" class="fjs-properties-panel-input" onInput={ handleInput } value={ value } { ...rest } />
    </div>
  );
}

function Select(props) {
  const {
    label,
    value,
    onChange,
    options,
    ...rest
  } = props;

  const handleChange = ({ target }) => {
    onChange(target.value);
  };

  return (
    <div class="fjs-properties-panel-textfield">
      <label class="fjs-properties-panel-label">{ label }</label>
      <select class="fjs-properties-panel-input" onInput={ handleChange } { ...rest }>
        {
          options.map((option) => {
            return <option value={ option.value } selected={ option.value === value }>{ option.label }</option>;
          })
        }
      </select>
    </div>
  );
}

function CheckboxEntry(props) {
  const {
    editField,
    field,
    label,
    path
  } = props;

  const [ property, nestedProperty ] = path;

  const onChange = (value) => {
    if (nestedProperty) {
      editField(field, [ property ], set(get(field, [ property ], {}), [ nestedProperty ], value));
    } else {
      editField(field, path, value);
    }
  };

  const checked = useMemo(() => get(field, path, false), [ get(field, path, false) ]);

  return (
    <div class="fjs-properties-panel-entry">
      <Checkbox label={ label } onChange={ onChange } checked={ checked } />
    </div>
  );
}

function NumberEntry(props) {
  const {
    editField,
    field,
    label,
    path
  } = props;

  const [ property, nestedProperty ] = path;

  const onInput = (value) => {
    if (nestedProperty) {
      editField(field, [ property ], set(get(field, [ property ], {}), [ nestedProperty ], value));
    } else {
      editField(field, path, value);
    }
  };

  const value = useMemo(() => get(field, path, ''), [ get(field, path, '') ]);

  return (
    <div class="fjs-properties-panel-entry">
      <Number label={ label } onInput={ onInput } value={ value } />
    </div>
  );
}

function TextfieldEntry(props) {
  const {
    editField,
    field,
    label,
    path
  } = props;

  const [ property, nestedProperty ] = path;

  const onInput = (value) => {
    if (nestedProperty) {
      editField(field, [ property ], set(get(field, [ property ], {}), [ nestedProperty ], value));
    } else {
      editField(field, path, value);
    }
  };

  const value = useMemo(() => get(field, path, ''), [ get(field, path, '') ]);

  return (
    <div class="fjs-properties-panel-entry">
      <Textfield label={ label } onInput={ onInput } value={ value } />
    </div>
  );
}

function LabelProperty(props) {
  const {
    editField,
    field
  } = props;

  return TextfieldEntry({
    editField,
    field,
    label: 'Label',
    path: [ 'label' ]
  });
}

function DescriptionProperty(props) {
  const {
    editField,
    field
  } = props;

  return TextfieldEntry({
    editField,
    field,
    label: 'Description',
    path: [ 'description' ]
  });
}

// TODO: Check whether key unique
function KeyProperty(props) {
  const {
    editField,
    field
  } = props;

  return TextfieldEntry({
    editField,
    field,
    label: 'Key',
    path: [ 'key' ]
  });
}

function ActionProperty(props) {
  const {
    editField,
    field
  } = props;

  const onChange = (value) => {
    editField(field, 'action', value);
  };

  const value = useMemo(() => field.action, [ field.action ]);

  const options = [
    {
      label: 'Submit',
      value: 'submit'
    },
    {
      label: 'Reset',
      value: 'reset'
    }
  ];

  return (
    <div class="fjs-properties-panel-entry">
      <Select label="Action" options={ options } onChange={ onChange } value={ value } />
    </div>
  );
}

function ColumnsProperty(props) {
  const {
    editField,
    field
  } = props;

  const onInput = (value) => {
    let components = field.components.slice();

    if (value > components.length) {
      while (value > components.length) {
        components.push(DefaultRenderer.create({ parent: field.id }));
      }
    } else {
      components = components.slice(0, value);
    }

    editField(field, 'components', components);
  };

  const value = useMemo(() => field.components.length, [ field.components.length ]);

  return (
    <div class="fjs-properties-panel-entry">
      <Number label="Columns" onInput={ onInput } value={ value } min="1" max="3" />
    </div>
  );
}

function Group(props) {
  const {
    children,
    label
  } = props;

  const [ open, setOpen ] = useState(true);

  const toggleOpen = () => setOpen(!open);

  return <div class="fjs-properties-panel-group">
    <div class="fjs-properties-panel-group-header" onClick={ toggleOpen }>
      <div>
        { label }
      </div>
      <ChevronIcon width="16" height="16" class={ open ? 'fjs-chevron-down' : 'fjs-chevron-right' } />
    </div>
    {
      open
        ? (
          <div class="fjs-properties-panel-group-entries">
            {
              children
            }
          </div>
        )
        : null
    }
  </div>;
}

function DesignGroup(field, editField) {
  const { type } = field;

  const entries = [];

  if (FIELDS.includes(type) || type === 'button') {
    entries.push(<LabelProperty editField={ editField } field={ field } />);
  }

  if (FIELDS.includes(type)) {
    entries.push(<DescriptionProperty editField={ editField } field={ field } />);
  }

  if (FIELDS.includes(type)) {
    entries.push(<KeyProperty editField={ editField } field={ field } />);
  }

  if (type === 'button') {
    entries.push(<ActionProperty editField={ editField } field={ field } />);
  }

  if (type === 'columns') {
    entries.push(<ColumnsProperty editField={ editField } field={ field } />);
  }

  return (
    <Group label="Design">
      {
        entries
      }
    </Group>
  );
}

function ValidationGroup(field, editField) {
  const { type } = field;

  const entries = [
    <CheckboxEntry field={ field } editField={ editField } label="Required" path={ [ 'validate', 'required' ] } />
  ];

  if (type === 'textfield') {
    entries.push(
      TextfieldEntry({
        editField,
        field,
        label: 'Pattern',
        path: [ 'validate', 'pattern' ]
      }),
      NumberEntry({
        editField,
        field,
        label: 'Minimum Length',
        path: [ 'validate', 'minLength' ]
      }),
      NumberEntry({
        editField,
        field,
        label: 'Maximum Length',
        path: [ 'validate', 'maxLength' ]
      })
    );
  }

  return (
    <Group label="Validation">
      {
        entries
      }
    </Group>
  );
}

function getGroups(field, editField) {
  const { type } = field;

  const groups = [
    DesignGroup(field, editField)
  ];

  if (FIELDS.includes(type)) {
    groups.push(ValidationGroup(field, editField));
  }

  return groups;
}

export default function PropertiesPanel(props) {
  const {
    editField,
    field
  } = props;

  if (!field || field.type === 'default') {
    return <div class="fjs-properties-panel-placeholder">Select a form field to edit its properties.</div>;
  }

  const { type } = field;

  const Icon = iconsByType[ type ];

  const label = labelsByType[ type ];

  return <div class="fjs-properties-panel">
    <div class="fjs-properties-panel-header">
      <div class="fjs-properties-panel-header-icon">
        <Icon width="36" height="36" viewBox="0 0 54 54" />
      </div>
      <div>
        <span class="fjs-properties-panel-header-type">{ label }</span>
        {
          field.label
            ? <div class="fjs-properties-panel-header-label">{ field.label }</div>
            : null
        }
      </div>
    </div>
    {
      getGroups(field, editField)
    }
  </div>;
}