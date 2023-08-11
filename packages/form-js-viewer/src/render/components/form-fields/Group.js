import { useContext } from 'preact/hooks';
import Grid from './parts/Grid';
import { FormRenderContext } from '../../context';

export default function Group(props) {

  const { field } = props;

  const { label } = field;

  const {
    Empty,
  } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty };

  return (
    <fieldset class="fjs-form-group">
      { label == null ? null : <legend>{ label }</legend> }
      <Grid { ...fullProps } />
    </fieldset>
  );
}

Group.config = {
  type: 'group',
  routed: true,
  label: 'Group',
  group: 'presentation',
  create: (options = {}) => ({
    components: [],
    ...options
  })
};
