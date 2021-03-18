import { useContext } from 'preact/hooks';

import FormElement from '../FormElement';

import { FormRenderContext } from '../context';

import DefaultRenderer from './DefaultRenderer';

import {
  generateIdForType,
  idToLabel
} from '../../util';


export default function ColumnsRenderer(props) {
  const {
    Children,
    Element,
    Empty
  } = useContext(FormRenderContext);

  const {
    dataPath,
    field,
    schemaPath
  } = props;

  const { components = [] } = field;

  return (
    <Element class="fjs-columns" field={ field } dataPath={ dataPath } schemaPath={ [ ...schemaPath, 'components' ] }>
      {
        components.length
          ? components.map((column, index) => {
            return (
              <div class="fjs-column">
                <FormElement
                  { ...props }
                  field={ column }
                  dataPath={ dataPath.slice(0, -1) }
                  schemaPath={ [ ...schemaPath, 'components', index ] } />
              </div>
            );
          })
          : <Empty />
      }
    </Element>
  );
}

ColumnsRenderer.create = function(options = {}) {
  const type = 'columns';

  const id = generateIdForType(type);

  return {
    components: [
      DefaultRenderer.create({ parent: id }),
      DefaultRenderer.create({ parent: id })
    ],
    id,
    type,
    ...options
  };
};

ColumnsRenderer.type = 'columns';

ColumnsRenderer.label = 'Columns';