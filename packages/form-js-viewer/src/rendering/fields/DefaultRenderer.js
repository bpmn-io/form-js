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
    field,
    path
  } = props;

  const { id } = field;

  const { components = [] } = field;

  return <Children class="fjs-vertical-layout" field={ field }>
    {
      components.map((field) => {
        if (field.key) {
          path = [ ...path.slice(0, -1), field.key ];
        } else {
          path = path.slice(0, -1);
        }

        return <FormElement
          { ...props }
          key={ id }
          path={ path }
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