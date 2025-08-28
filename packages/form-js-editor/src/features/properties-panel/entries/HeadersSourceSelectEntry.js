import { AutoFocusSelectEntry } from '../components';

import { get, isString, isArray } from 'min-dash';
import { isEditedFromDefaultFactory } from '../Util';

const OPTIONS = (translate) => {
  return{
    static: {
      label: translate('List of items'),
      value: 'static',
    },
    expression: {
      label: translate('Expression'),
      value: 'expression',
    },
  }
};


const COLUMNS_PATH = ['columns'];

const COLUMNS_EXPRESSION_PATH = ['columnsExpression'];


export function HeadersSourceSelectEntry(props) {
  const { editField, field, id, translate} = props;
  const isHeadersSourceEdited = isEditedFromDefaultFactory(OPTIONS(translate).static.value);

  return [
    {
      id: id + '-select',
      component: HeadersSourceSelect,
      isEdited: isHeadersSourceEdited,
      editField,
      field,
      translate,
    },
  ];
}

function HeadersSourceSelect(props) {
  const { editField, field, id, translate } = props;

  const SELECT_OPTIONS = Object.values(OPTIONS(translate));

  /**
   * @returns {string|void}
   */
  const getValue = () => {
    const columns = get(field, COLUMNS_PATH);
    const columnsExpression = get(field, COLUMNS_EXPRESSION_PATH);

    if (isString(columnsExpression)) {
      return OPTIONS(translate).expression.value;
    }

    if (isArray(columns)) {
      return OPTIONS(translate).static.value;
    }
  };

  /**
   * @param {string|void} value
   */
  const setValue = (value) => {
    switch (value) {
      case OPTIONS(translate).static.value:
        editField(field, {
          columns: [
            {
              label: 'Column',
              key: 'inputVariable',
            },
          ],
        });
        break;
      case OPTIONS(translate).expression.value:
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
    label: translate('Type'),
    element: field,
    getOptions: getValuesSourceOptions,
    getValue,
    id,
    setValue,
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
