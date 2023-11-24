import { isSelectEntryEdited } from '@bpmn-io/properties-panel';

import { AutoFocusSelectEntry } from '../components';

import { get, isString, isArray } from 'min-dash';


const OPTIONS = {
  static: {
    label: 'List of items',
    value: 'static'
  },
  expression: {
    label: 'Expression',
    value: 'expression'
  }
};

const SELECT_OPTIONS = Object.values(OPTIONS);

const COLUMNS_PATH = [ 'columns' ];

const COLUMNS_EXPRESSION_PATH = [ 'columnsExpression' ];

export function HeadersSourceSelectEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  return [
    {
      id: id + '-select',
      component: HeadersSourceSelect,
      isEdited: isSelectEntryEdited,
      editField,
      field
    }
  ];
}

function HeadersSourceSelect(props) {

  const {
    editField,
    field,
    id
  } = props;

  /**
   * @returns {string|void}
   */
  const getValue = () => {
    const columns = get(field, COLUMNS_PATH);
    const columnsExpression = get(field, COLUMNS_EXPRESSION_PATH);

    if (isString(columnsExpression)) {
      return OPTIONS.expression.value;
    }

    if (isArray(columns)) {
      return OPTIONS.static.value;
    }
  };

  /**
   * @param {string|void} value
   */
  const setValue = (value) => {
    switch (value) {
    case OPTIONS.static.value:
      editField(field, {
        columns: [
          {
            label: 'Column',
            key: 'inputVariable'
          }
        ]
      });
      break;
    case OPTIONS.expression.value:
      editField(field, {
        columnsExpression: '=',
      });
      break;
    }
  };

  const getValuesSourceOptions = () => {

    return SELECT_OPTIONS;
  };

  return AutoFocusSelectEntry({
    autoFocusEntry: getAutoFocusEntryId(field),
    label: 'Type',
    element: field,
    getOptions: getValuesSourceOptions,
    getValue,
    id,
    setValue
  });
}

// helpers //////////

function getAutoFocusEntryId(field) {
  const columns = get(field, COLUMNS_PATH);
  const columnsExpression = get(field, COLUMNS_EXPRESSION_PATH);

  if (isString(columnsExpression)) {
    return `${field.id}-columnsExpression`;
  }

  if (isArray(columns)) {
    return `${field.id}-columns-0-label`;
  }

  return null;
}
