import { useContext } from 'preact/hooks';
import { FormRenderContext } from '../../context';
import ChildrenRenderer from './parts/ChildrenRenderer';

export default function FormComponent(props) {

  const {
    EmptyRoot,
  } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty: EmptyRoot };

  return <ChildrenRenderer { ...fullProps } />;
}

FormComponent.config = {
  type: 'default',
  keyed: false,
  label: null,
  group: null,
  create: (options = {}) => ({
    components: [],
    ...options
  })
};
