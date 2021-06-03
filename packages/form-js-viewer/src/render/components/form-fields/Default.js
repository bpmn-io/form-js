import { useContext } from 'preact/hooks';

import FormField from '../FormField';

import { FormRenderContext } from '../../context';

import { generateIdForType } from '../../../util';


export default function Default(props) {
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

        return <FormField
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

Default.create = function(options = {}) {
  const id = generateIdForType(this.type);

  return {
    components: [],
    id,
    label: this.label,
    type: this.type,
    ...options
  };
};

Default.type = 'default';

Default.label = 'Default';