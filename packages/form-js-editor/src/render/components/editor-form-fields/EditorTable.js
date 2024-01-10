import { Label, Table } from '@bpmn-io/form-js-viewer';
import { editorFormFieldClasses } from '../Util';
import classNames from 'classnames';

/**
 * @param {import('@bpmn-io/form-js-viewer/src/render/components/form-fields/Table').Props} props
 * @returns {import("preact").JSX.Element}
 */
export function EditorTable(props) {
  const { columnsExpression, columns, id, label } = props.field;
  const shouldUseMockColumns =
    (typeof columnsExpression === 'string' && columnsExpression.length > 0) ||
    (Array.isArray(columns) && columns.length === 0);
  const editorColumns = shouldUseMockColumns
    ? [
      { key: '1', label: 'Column 1' },
      { key: '2', label: 'Column 2' },
      { key: '3', label: 'Column 3' }
    ]
    : columns;
  const prefixId = `fjs-form-${id}`;

  return (
    <div class={ editorFormFieldClasses('table', { disabled: true }) }>
      <Label id={ prefixId } label={ label } />
      <div class="fjs-table-middle-container">
        <div class="fjs-table-inner-container">
          <table class={ classNames('fjs-table', 'fjs-disabled') } id={ prefixId }>
            <thead class="fjs-table-head">
              <tr class="fjs-table-tr">
                {editorColumns.map(({ key, label }) => (
                  <th key={ key } class="fjs-table-th">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="fjs-table-body">
              <tr class="fjs-table-tr">
                {editorColumns.map(({ key }) => (
                  <td class="fjs-table-td" key={ key }>
                    Content
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

EditorTable.config = Table.config;
