import { useContext } from 'preact/hooks';
import Grid from './parts/Grid';
import { FormContext, FormRenderContext } from '../../context';
import { formFieldClasses, prefixId } from '../Util';
import Label from '../Label';
import classNames from 'classnames';

export default function Group(props) {

  const { field } = props;
  const { label, id, type } = field;
  const { formId } = useContext(FormContext);

  const {
    Empty,
  } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty };

  return (
    <div className={ classNames(formFieldClasses(type)) } role="group" aria-labelledby={ prefixId(id, formId) }>
      <Label
        id={ prefixId(id, formId) }
        label={ label } />
      <Grid { ...fullProps } />
    </div>
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
