import { useContext } from 'preact/hooks';

import FormField from '../FormField';

import { FormRenderContext } from '../../context';


export default function Default(props) {
  const {
    Children,
    Empty
  } = useContext(FormRenderContext);

  const { field } = props;

  const { components = [] } = field;

  return <Children class="fjs-vertical-layout" field={ field }>
    {
      components.map(childField => {
        return <FormField
          { ...props }
          key={ childField.id }
          field={ childField } />;
      })
    }
    {
      components.length ? null : <Empty />
    }
  </Children>;
}

Default.create = function(options = {}) {
  return {
    components: [],
    ...options
  };
};

Default.type = 'default';
Default.keyed = false;