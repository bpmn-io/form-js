import classNames from 'classnames';
import { useContext } from 'preact/hooks';
import { FormRenderContext } from '../../context';
import { formFieldClasses } from '../Util';
import { Label } from '../Label';
import { ChildrenRenderer } from './parts/ChildrenRenderer';

export function Group(props) {
  const { field, domId } = props;
  const { label, type, showOutline } = field;
  const { Empty } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty };

  return (
    <div
      className={classNames(formFieldClasses(type), 'fjs-form-field-grouplike', { 'fjs-outlined': showOutline })}
      role="group"
      aria-labelledby={domId}>
      <Label id={domId} label={label} />
      <ChildrenRenderer {...fullProps} />
    </div>
  );
}

Group.config = {
  type: 'group',
  pathed: true,
  name: 'Group',
  group: 'container',
  create: (options = {}) => ({
    label: 'Group',
    components: [],
    showOutline: true,
    ...options,
  }),
};
