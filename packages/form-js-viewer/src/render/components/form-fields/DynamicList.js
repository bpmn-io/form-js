import { useContext } from 'preact/hooks';
import { FormRenderContext } from '../../context';
import { formFieldClasses } from '../Util';
import classNames from 'classnames';

import { Label } from '../Label';
import { ChildrenRenderer } from './parts/ChildrenRenderer';

export function DynamicList(props) {

  const { field, domId, readonly } = props;
  const { label, type, showOutline } = field;

  const {
    Empty,
  } = useContext(FormRenderContext);

  const fullProps = { ...props, Empty };

  return (
    <div
      className={
        classNames(
          formFieldClasses(type, { readonly }),
          'fjs-form-field-grouplike',
          {
            'fjs-outlined' : showOutline
          }
        )
      }
      role="group"
      aria-labelledby={ domId }
    >
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
  group: 'container',
  create: (options = {}) => ({
    components: [],
    showOutline: true,
    isRepeating: true,
    allowAddRemove: true,
    defaultRepetitions: 1,
    ...options
  })
};
