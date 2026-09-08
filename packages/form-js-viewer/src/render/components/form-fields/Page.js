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
  const { activePageId, showAllPages, focusOnMount } = useContext(MultiPageContext);

  const isActive = showAllPages || activePageId === field.id;
  const wasActive = usePrevious(isActive);

  const rootRef = useRef(null);

  // a page takes focus when the user arrives on it, either by navigating to it or
  // because a condition put it in place of the page that was in view; `wasActive`
  // is null on the first render, so the page the form opens with does not steal focus
  const arrived = isActive && (wasActive === false || (wasActive === null && focusOnMount));

  useEffect(() => {
    if (!arrived || !rootRef.current) {
      return;
    }

    const focusables = Array.from(rootRef.current.querySelectorAll(FOCUSABLE_SELECTOR));

    // a nested multipage keeps its other pages mounted but hidden, and focusing
    // one of those would leave focus off screen
    const target = focusables.find((element) => element.offsetParent !== null) || rootRef.current;

    target.focus();
  }, [arrived]);

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
