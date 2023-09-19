import { useContext } from 'preact/hooks';
import ChildrenRenderer from './parts/ChildrenRenderer';
import { FormContext, FormRenderContext } from '../../context';
import { formFieldClasses, prefixId } from '../Util';
import Label from '../Label';
import classNames from 'classnames';

export default function DynamicList(props) {

  const { field } = props;
  const { label, id, type, showOutline } = field;
  const { formId } = useContext(FormContext);

  const {
    Empty,
  } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty };

  return (
    <div className={ classNames(formFieldClasses(type), 'fjs-form-field-grouplike', { 'fjs-outlined' : showOutline }) } role="group" aria-labelledby={ prefixId(id, formId) }>
      <Label
        id={ prefixId(id, formId) }
        label={ label } />
      <ChildrenRenderer { ...fullProps } />
    </div>
  );
}

DynamicList.config = {
  type: 'dynamiclist',
  pathed: true,
  repeatable: true,
  label: 'Dynamic list',
  group: 'presentation',
  create: (options = {}) => ({
    components: [],
    showOutline: true,
    isRepeating: true,
    ...options
  })
};
