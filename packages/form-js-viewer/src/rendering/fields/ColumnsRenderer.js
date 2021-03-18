import { useContext } from 'preact/hooks';

import FormElement from '../FormElement';

import { FormRenderContext } from '../context';

import DefaultRenderer from './DefaultRenderer';

import { generateIdForType } from '../../util';


export default function ColumnsRenderer(props) {
  const {
    Element,
    Empty
  } = useContext(FormRenderContext);

  const {
    field,
    path
  } = props;

  const { components = [] } = field;

  return (
    <Element class="fjs-columns" field={ field }>
      {
        components.length
          ? components.map((column) => {
            return (
              <div class="fjs-column">
                <FormElement
                  { ...props }
                  field={ column }
                  path={ path.slice(0, -1) } />
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