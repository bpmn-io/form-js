import classNames from 'classnames';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { FormRenderContext, MultiPageContext } from '../../context';
import { formFieldClasses } from '../Util';
import { ChildrenRenderer } from './parts/ChildrenRenderer';
import { usePrevious, useSingleLineTemplateEvaluation } from '../../hooks';

const type = 'page';

export function Page(props) {
  const { field, domId } = props;
  const { label, showOutline } = field;

  const { Empty } = useContext(FormRenderContext);
  const { activePageId, showAllPages, focusOnMount } = useContext(MultiPageContext);

  const isActive = showAllPages || activePageId === field.id;
  const wasActive = usePrevious(isActive);

  const title = useSingleLineTemplateEvaluation(label || '', { debug: true });

  const rootRef = useRef(null);
  const titleRef = useRef(null);

  // a page takes focus when the user arrives on it, either by navigating to it or
  // because a condition put it in place of the page that was in view; `wasActive`
  // is null on the first render, so the page the form opens with does not steal focus
  const arrived = isActive && (wasActive === false || (wasActive === null && focusOnMount));

  // the title tells a screen reader user where they arrived, and focusing it
  // rather than a field keeps a select or date picker from opening on its own
  useEffect(() => {
    if (!arrived) {
      return;
    }

    const target = titleRef.current || rootRef.current;

    target && target.focus();
  }, [arrived]);

  const fullProps = { ...props, Empty };

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={classNames(formFieldClasses(type), 'fjs-form-field-grouplike', { 'fjs-outlined': showOutline })}
      role="group"
      aria-labelledby={title ? domId : undefined}>
      {title ? (
        <h2 ref={titleRef} id={domId} tabIndex={-1} class="fjs-page-title">
          {title}
        </h2>
      ) : null}
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
