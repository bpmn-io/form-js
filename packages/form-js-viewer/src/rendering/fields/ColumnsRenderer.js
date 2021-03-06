import { useContext } from 'preact/hooks';

import FormElement from '../FormElement';

import { FormRenderContext } from '../context';

export default function ColumnsRenderer(props) {
  const { Children } = useContext(FormRenderContext);

  const {
    dataPath,
    field,
    schemaPath
  } = props;

  return (
    <Children class="fjs-columns" dataPath={ dataPath } schemaPath={ [ ...schemaPath, 'columns' ] }>
      {
        field.columns.map((column, index) => {
          return (
            <div class="fjs-column">
              <FormElement
                { ...props }
                field={ column }
                dataPath={ dataPath.slice(0, -1) }
                schemaPath={ [ ...schemaPath, 'columns', index ] } />
            </div>
          );
        })
      }
    </Children>
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