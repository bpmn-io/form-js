import { useContext } from 'preact/hooks';

import FormElement from '../FormElement';

import { FormRenderContext } from '../context';

export default function Default(props) {
  const {
    Children
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
  </Children>;
}

Default.create = function(options = {}) {
  return {
    type: 'default',
    ...options
  };
};