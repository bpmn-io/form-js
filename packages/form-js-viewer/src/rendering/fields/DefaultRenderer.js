import { useContext } from 'preact/hooks';

import FormElement from '../FormElement';

import { FormRenderContext } from '../context';

import {
  generateIdForType,
  idToLabel
} from '../../util';


export default function DefaultRenderer(props) {
  const {
    Children,
    Empty
  } = useContext(FormRenderContext);

  let {
    dataPath,
    field,
    id,
    schemaPath
  } = props;

  const { components = [] } = field;

  return <Children class="fjs-vertical-layout" { ...props }>
    {
      components.map((field, index) => {
        if (field.key) {
          dataPath = [ ...dataPath.slice(0, -1), field.key ];
        } else {
          dataPath = dataPath.slice(0, -1);
        }

        return <FormElement
          { ...props }
          key={ id }
          dataPath={ dataPath }
          schemaPath={ [ ...schemaPath, 'components', index ] }
          field={ field } />;
      })
    }
    {
      components.length ? null : <Empty />
    }
  </Children>;
}

DefaultRenderer.create = function(options = {}) {
  const type = 'default';
  
  const id = generateIdForType(type);

  return {
    components: [],
    id,
    label: idToLabel(id),
    type,
    ...options
  };
};

DefaultRenderer.type = 'default';

DefaultRenderer.label = 'Default';