import { useContext } from 'preact/hooks';
import { FormRenderContext } from '../../context';
import { ChildrenRenderer } from './parts/ChildrenRenderer';

export function Default(props) {

  const {
    Empty,
  } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty };

  return <ChildrenRenderer { ...fullProps } />;
}

Default.config = {
  type: 'default',
  keyed: false,
  label: null,
  group: null,
  create: (options = {}) => ({
    components: [],
    ...options
  })
};
