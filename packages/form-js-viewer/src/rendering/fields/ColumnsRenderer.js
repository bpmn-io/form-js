import { For, splitProps } from 'solid-js';

import FormElement from '../FormElement';

import { computePath } from '../../util';

export default function ColumnsRenderer(props) {
  const [ localProps, otherProps ] = splitProps(props, [ 'field', 'dataPath', 'schemaPath' ]);

  const childrenSchemaPath = computePath(() => [ ...props.schemaPath, 'columns' ]);

  return (
    <FormElement.Children class="columns" dataPath={ props.dataPath } schemaPath={ childrenSchemaPath() }>
      <For each={ localProps.field.columns }>
        {
          (column, index) => {
            const dataPath = computePath(() => props.dataPath.slice(0, -1));

            const childSchemaPath = computePath(() => [ ...childrenSchemaPath(), index() ]);

            return (
              <div class="column">
                <FormElement field={ column } dataPath={ dataPath() } schemaPath={ childSchemaPath() } { ...otherProps } />
              </div>
            );
          }
        }
      </For>
      <FormElement.Empty dataPath={ props.dataPath } schemaPath={ props.schemaPath } />
    </FormElement.Children>
  );
}

ColumnsRenderer.create = function(options = {}) {
  return {
    label: 'Columns',
    type: 'columns',
    columns: [
      {
        components: []
      },
      {
        components: []
      }
    ],
    ...options
  };
};