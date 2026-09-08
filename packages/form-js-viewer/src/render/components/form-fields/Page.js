import classNames from 'classnames';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { FormRenderContext, MultiPageContext } from '../../context';
import { formFieldClasses } from '../Util';
import { Label } from '../Label';
import { ChildrenRenderer } from './parts/ChildrenRenderer';
import { usePrevious } from '../../hooks';

const type = 'page';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function Page(props) {
  const { field, domId } = props;
  const { label, showOutline } = field;

  const { Empty } = useContext(FormRenderContext);
  const { activePageId, showAllPages } = useContext(MultiPageContext);

  const isActive = showAllPages || activePageId === field.id;
  const wasActive = usePrevious(isActive);

  const rootRef = useRef(null);

  // move focus onto a page the user navigated to; `wasActive === undefined` on the
  // first render, so the page shown when the form opens does not steal focus
  useEffect(() => {
    if (!isActive || wasActive !== false || !rootRef.current) {
      return;
    }

    const target = rootRef.current.querySelector(FOCUSABLE_SELECTOR) || rootRef.current;

    target.focus();
  }, [isActive, wasActive]);

  const fullProps = { ...props, Empty };

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={classNames(formFieldClasses(type), 'fjs-form-field-grouplike', { 'fjs-outlined': showOutline })}
      role="group"
      aria-labelledby={domId}>
      <Label id={domId} label={label} />
      <ChildrenRenderer {...fullProps} />
    </div>
  );
}

Page.config = {
  type,
  name: 'Page',
  group: 'container',
  create: (options = {}) => ({
    label: 'Page',
    components: [],
    showOutline: true,
    ...options,
  }),
};
