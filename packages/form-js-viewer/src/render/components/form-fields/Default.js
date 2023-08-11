import { useContext } from 'preact/hooks';
import { FormRenderContext } from '../../context';
import Grid from './parts/Grid';

export default function FormComponent(props) {

  const {
    EmptyRoot,
  } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty: EmptyRoot };

  return <Grid { ...fullProps } />;
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
