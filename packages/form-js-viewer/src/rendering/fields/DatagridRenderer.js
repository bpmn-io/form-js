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

  const rows = findData(data, props.path);

  if (!rows) {
    return null;
  }

  const {
    field,
    onChange,
    path
  } = props;

  const addValue = () => {
    onChange({
      path,
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
              path,
              value: rows.filter((_, i) => i !== index)
            });
          };

          const components = field.components || [];

          return <div class="fjs-datagrid-row">
            <Children path={ props.path }>
              {
                components.map((component) => {
                  return (
                    <FormElement
                      { ...props }
                      field={ component }
                      path={ [ ...props.path, index(), component.key ] }
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