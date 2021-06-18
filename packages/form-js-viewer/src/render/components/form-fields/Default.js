import { useContext } from 'preact/hooks';

import FormField from '../FormField';

import { FormRenderContext } from '../../context';

import { generateIdForType } from '../../../util';


export default function Default(props) {
  const {
    Children,
    Empty
  } = useContext(FormRenderContext);

  const { field } = props;

  const { _id } = field;

  const { components = [] } = field;

  return <Children class="fjs-vertical-layout" field={ field }>
    {
      components.map((field) => {
        return <FormField
          { ...props }
          key={ _id }
          field={ field } />;
      })
    }
    {
      components.length ? null : <Empty />
    }
  </Children>;
}

Default.create = function(options = {}) {
  const _id = generateIdForType(this.type);

  return {
    components: [],
    _id,
    label: this.label,
    type: this.type,
    ...options
  };
};

Default.type = 'default';

Default.label = 'Default';