import { get } from 'min-dash';
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'preact/hooks';

import { FormRenderContext, MultiPageContext } from '../../context';
import { useService, useSingleLineTemplateEvaluation } from '../../hooks';
import { formFieldClasses } from '../Util';
import { FormField } from '../FormField';

const type = 'multipage';

// input types on which the browser does not submit the form on enter
const NON_SUBMITTING_INPUT_TYPES = ['button', 'submit', 'reset', 'file'];

const EMPTY_STATE = { activePageId: null, visiblePageIds: [], index: -1 };

export function MultiPage(props) {
  const { field, indexes, readonly, disabled } = props;

  const { Children } = useContext(FormRenderContext);

  const { components, showSubmit } = field;
  const pages = useMemo(() => components || [], [components]);

  const eventBus = useService('eventBus');
  const multiPageNavigation = useService('multiPageNavigation');

  // the navigation service resolves and commits the page in view, including any
  // move a condition forces; the container only renders what it reports
  const [, rerender] = useReducer((count) => count + 1, 0);

  // subscribe as part of the commit, so that a navigation right after a render
  // cannot slip in before the subscription is in place
  useLayoutEffect(() => {
    const onPageChanged = ({ formField }) => {
      if (formField.id === field.id) {
        rerender();
      }
    };

    eventBus.on('multipage.pageChanged', onPageChanged);

    return () => eventBus.off('multipage.pageChanged', onPageChanged);
  }, [eventBus, field.id]);

  const { activePageId, visiblePageIds, index: activeIndex } = multiPageNavigation.getState(field.id) || EMPTY_STATE;

  const visiblePages = toPages(pages, visiblePageIds);

  const activePage = activeIndex === -1 ? null : visiblePages[activeIndex] || null;

  // user actions go through the service, so that a host may veto them;
  // a read-only form can be paged through, but its fields cannot be corrected,
  // so moving on neither reports errors nor waits for them to be fixed
  const onNext = useCallback(
    () => multiPageNavigation.next(field.id, { validate: !readonly }),
    [field.id, multiPageNavigation, readonly],
  );

  const onBack = useCallback(() => multiPageNavigation.back(field.id), [field.id, multiPageNavigation]);

  // a failing field on a page that is not on screen is invisible to the user,
  // so bring the first such page forward when submission is rejected
  useEffect(() => {
    const onSubmit = ({ errors }) => {
      const state = multiPageNavigation.getState(field.id);

      if (!state) {
        return;
      }

      const failing = toPages(pages, state.visiblePageIds).find((page) => hasErrors(page, errors));

      if (failing && failing.id !== state.activePageId) {
        multiPageNavigation.navigate(field.id, failing.id);
      }
    };

    eventBus.on('submit', onSubmit);

    return () => eventBus.off('submit', onSubmit);
  }, [eventBus, field.id, multiPageNavigation, pages]);

  // a page that mounts already active arrived because a condition moved the
  // user to it, unless the container is only opening on it
  // while a condition hides every page there is none in view, so compare with
  // the page the user was on last
  const lastActivePageId = useRef(null);

  const focusOnMount = lastActivePageId.current !== null && lastActivePageId.current !== activePageId;

  useEffect(() => {
    if (activePageId !== null) {
      lastActivePageId.current = activePageId;
    }
  }, [activePageId]);

  const multiPageContext = useMemo(
    () => ({ activePageId, showAllPages: false, focusOnMount }),
    [activePageId, focusOnMount],
  );

  // enter in a field moves to the next page, as the browser would otherwise
  // submit the whole form from a page the user has not finished
  const onKeyDown = (event) => {
    if (event.key !== 'Enter' || event.defaultPrevented || event.isComposing) {
      return;
    }

    const { target } = event;

    if (target.tagName !== 'INPUT' || NON_SUBMITTING_INPUT_TYPES.includes(target.type)) {
      return;
    }

    // on the last page in view the form submits as usual
    if (activeIndex === -1 || activeIndex >= visiblePages.length - 1) {
      return;
    }

    // stops the browser's implicit form submission
    event.preventDefault();

    onNext();
  };

  if (!visiblePages.length) {
    return null;
  }

  return (
    <div className={formFieldClasses(type)} onKeyDown={onKeyDown}>
      <MultiPageContext.Provider value={multiPageContext}>
        <Children class="fjs-vertical-layout fjs-children" field={field}>
          {visiblePages.map((page) => (
            <div key={page.id} class="fjs-layout-row" style={{ display: page.id === activePageId ? null : 'none' }}>
              <FormField {...props} field={page} indexes={indexes} />
            </div>
          ))}
        </Children>
      </MultiPageContext.Provider>
      <Navigation
        field={field}
        page={activePage}
        showBack={activeIndex > 0}
        showNext={activeIndex < visiblePages.length - 1}
        showSubmit={showSubmit && activeIndex === visiblePages.length - 1}
        onBack={onBack}
        onNext={onNext}
        readonly={readonly}
        disabled={disabled}
      />
    </div>
  );
}

MultiPage.config = {
  type,
  name: 'Multi page',
  group: 'container',
  allowedParents: ['default'],
  allowedChildren: ['page'],
  create: (options = {}) => ({
    components: [],
    ...options,
  }),
};

function Navigation(props) {
  const { field, page, showBack, showNext, showSubmit, onBack, onNext, readonly, disabled } = props;

  const translate = useService('translate');

  // a page may override the labels its container sets for all of its pages
  const backLabel = useSingleLineTemplateEvaluation((page && page.backLabel) || field.backLabel || translate('Back'), {
    debug: true,
  });
  const nextLabel = useSingleLineTemplateEvaluation((page && page.nextLabel) || field.nextLabel || translate('Next'), {
    debug: true,
  });
  const submitLabel = useSingleLineTemplateEvaluation(
    (page && page.submitLabel) || field.submitLabel || translate('Submit'),
    { debug: true },
  );

  if (!showBack && !showNext && !showSubmit) {
    return null;
  }

  return (
    <div class="fjs-multipage-navigation">
      {showBack ? (
        <button type="button" class="fjs-button fjs-multipage-back" disabled={disabled} onClick={onBack}>
          {backLabel}
        </button>
      ) : null}
      {showNext ? (
        <button type="button" class="fjs-button fjs-multipage-next" disabled={disabled} onClick={onNext}>
          {nextLabel}
        </button>
      ) : null}
      {showSubmit ? (
        <button type="submit" class="fjs-button fjs-multipage-submit" disabled={disabled || readonly}>
          {submitLabel}
        </button>
      ) : null}
    </div>
  );
}

function toPages(pages, pageIds) {
  return pageIds.map((id) => pages.find((page) => page.id === id)).filter(Boolean);
}

function collectFieldIds(field, ids = new Set()) {
  (field.components || []).forEach((component) => {
    ids.add(component.id);
    collectFieldIds(component, ids);
  });

  return ids;
}

function hasErrors(page, errors) {
  return Array.from(collectFieldIds(page)).some((id) => get(errors, [id]));
}
