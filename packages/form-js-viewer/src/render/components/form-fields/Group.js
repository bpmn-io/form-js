import { useContext } from 'preact/hooks';
import { FormContext, FormRenderContext } from '../../context';
import { formFieldClasses, prefixId } from '../Util';
import Label from '../Label';
import classNames from 'classnames';
import ChildrenRenderer from './parts/ChildrenRenderer';

export default function Group(props) {

  const { field } = props;
  const { label, id, type, showOutline } = field;
  const { formId } = useContext(FormContext);
  const { Empty } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty };

  return (
    <div className={ classNames(formFieldClasses(type), { 'fjs-outlined' : showOutline }) } role="group" aria-labelledby={ prefixId(id, formId) }>
      <Label
        id={ prefixId(id, formId) }
        label={ label } />
      <ChildrenRenderer { ...fullProps } />
    </div>
  );
}

Group.config = {
  type: 'group',
  pathed: true,
  label: 'Group',
  group: 'container',
  create: (options = {}) => ({
    components: [],
    showOutline: true,
    ...options
  })
};
