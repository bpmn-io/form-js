import { useContext } from 'preact/hooks';
import { FormRenderContext } from '../../context';
import { formFieldClasses } from '../Util';

import Label from '../Label';
import ChildrenRenderer from './parts/ChildrenRenderer';
import classNames from 'classnames';

export default function DynamicList(props) {

  const { field, domId } = props;
  const { label, type, showOutline } = field;

  const {
    Empty,
  } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty };

  return (
    <div className={ classNames(formFieldClasses(type), 'fjs-form-field-grouplike', { 'fjs-outlined' : showOutline }) } role="group" aria-labelledby={ domId }>
      <Label
        id={ domId }
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
    allowAddRemove: true,
    defaultRepetitions: 1,
    ...options
  })
};
