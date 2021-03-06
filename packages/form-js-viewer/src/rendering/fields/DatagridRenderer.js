import { useContext } from 'preact/hooks';

import FormElement from '../FormElement';

import {
  FormContext,
  FormRenderContext
} from '../context';

import { findData } from '../../util';

export default function DatagridRenderer(props) {
  const { data } = useContext(FormContext);

  const { Children } = useContext(FormRenderContext);

  const rows = findData(data, props.dataPath);

  if (!rows) {
    return null;
  }

  const {
    dataPath,
    field,
    onChange
  } = props;

  const addValue = () => {
    onChange({
      dataPath,
      value: [
        ...rows(),
        {}
      ]
    });
  };

  return (
    <div class="fjs-form-field fjs-datagrid">
      <label>{ field.label }</label>
      {
        rows.map((_, index) => {
          const removeRow = () => {
            props.onChange({
              dataPath,
              value: rows.filter((_, i) => i !== index)
            });
          };

          const components = field.components || [];

          return <div class="fjs-datagrid-row">
            <Children dataPath={ props.dataPath } schemaPath={ [ ...props.schemaPath, 'components' ] }>
              {
                components.map((component) => {
                  return (
                    <FormElement
                      { ...props }
                      field={ component }
                      dataPath={ [ ...props.dataPath, index(), component.key ] }
                      schemaPath={ [ ...props.schemaPath, 'components', index ] }
                    />
                  );
                })
              }
            </Children>
            <button class="fjs-form-field" type="button" onClick={ removeRow }>-</button>
          </div>;
        })
      }
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