import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';
import { useService, useVariables } from '../hooks';
import { VALUES_SOURCES, VALUES_SOURCES_PATHS } from '@bpmn-io/form-js-viewer';


export default function ValuesExpressionEntry(props) {
  const {
    editField,
    field,
    id
  } = props;

  return [
    {
      id: id + '-expression',
      component: ValuesExpression,
      label: 'Values expression',
      isEdited: isFeelEntryEdited,
      editField,
      field
    }
  ];
}

function ValuesExpression(props) {
  const {
    editField,
    field,
    id
  } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map(name => ({ name }));

  const path = VALUES_SOURCES_PATHS[VALUES_SOURCES.EXPRESSION];

  const schema = '[\n  {\n    "label": "dollar",\n    "value": "$"\n  }\n]';

  const description = <div>
    Define an expression to populate the options from.
    <br /><br />The expression may result in an array of simple values or alternatively follow this schema:
    <pre><code>{schema}</code></pre>
  </div>;

  const getValue = () => get(field, path, '');

  const setValue = (value) => editField(field, path, value || '');

  return FeelEntry({
    debounce,
    description,
    element: field,
    feel: 'required',
    getValue,
    id,
    label: 'Options expression',
    setValue,
    variables
  });
}
