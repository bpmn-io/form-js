import {
  createMemo,
  For,
  splitProps,
  useContext
} from 'solid-js';

import FormElement from '../FormElement';

import { FormContext } from '../context';

import { computePath, findData } from '../../util';

export default function DatagridRenderer(props) {
  const { data } = useContext(FormContext);

  const [ _, others ] = splitProps(props, [ 'field', 'dataPath', 'schemaPath' ]);

  const rows = createMemo(() => findData(data, props.dataPath) || [], [], true);

  const addValue = () => {
    props.onChange({
      dataPath: props.dataPath,
      value: [
        ...rows(),
        {}
      ]
    });
  };

  return (
    <div class="form-field datagrid">
      <label>{ props.field.label }</label>
      <For each={ rows() }>
        {
          (_, index) => {
            const removeRow = () => {
              const newRows = rows().filter((row, i) => i !== index());

              props.onChange({
                dataPath: props.dataPath,
                value: newRows
              });
            };

            const components = createMemo(() => props.field.components, [], true);

            const childrenSchemaPath = computePath(() => [ ...props.schemaPath, 'components' ]);

            return <div class="datagrid-row">
              <FormElement.Children dataPath={ props.dataPath } schemaPath={ childrenSchemaPath() }>
                <For each={ components() }>
                  {
                    (component) => {

                      const dataPath = computePath(() => [ ...props.dataPath, index(), component.key ]);

                      const childSchemaPath = computePath(() => [ ...childrenSchemaPath(), index() ]);

                      return (
                        <FormElement
                          field={ component }
                          dataPath={ dataPath() }
                          schemaPath={ childSchemaPath() }
                          { ...others }
                        />
                      );
                    }
                  }
                </For>
                <FormElement.Empty dataPath={ props.dataPath } schemaPath={ props.schemaPath } />
              </FormElement.Children>
              <button class="form-field" type="button" onClick={ removeRow }>-</button>
            </div>;
          }
        }
      </For>
      <button type="button" onClick={ addValue }>+</button>
    </div>
  );
}

DatagridRenderer.create = function(options = {}) {
  return {
    label: 'Datagrid',
    type: 'datagrid',
    components: [],
    ...options
  };
};