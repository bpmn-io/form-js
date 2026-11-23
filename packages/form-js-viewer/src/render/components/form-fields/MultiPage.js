import { get } from 'min-dash';
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useState } from 'preact/hooks';

import { resolveActivePageId } from '../../../features/multiPageNavigation/MultiPageNavigation';
import { FormRenderContext, MultiPageContext } from '../../context';
import { useService, useSingleLineTemplateEvaluation } from '../../hooks';
import { formFieldClasses } from '../Util';
import { FormField } from '../FormField';

const type = 'multipage';

// input types on which the browser does not submit the form on enter
const NON_SUBMITTING_INPUT_TYPES = ['button', 'submit', 'reset', 'file'];

export function MultiPage(props) {
  const { field, indexes, readonly, disabled } = props;

  const { Children, applyVisibilityConditions } = useContext(FormRenderContext);

  const { components, showSubmit, disableInvalidNavigation } = field;
  const pages = useMemo(() => components || [], [components]);

  const visiblePages = useVisiblePages(pages, applyVisibilityConditions);

  const eventBus = useService('eventBus');
  const multiPageNavigation = useService('multiPageNavigation');

  // the position lives in the navigation service, which may be moved from outside
  const [, rerender] = useReducer((count) => count + 1, 0);

  useEffect(() => {
    const onPageChanged = ({ formField }) => {
      if (formField.id === field.id) {
        rerender();
      }
    };

    eventBus.on('multipage.pageChanged', onPageChanged);

    return () => eventBus.off('multipage.pageChanged', onPageChanged);
  }, [eventBus, field.id]);

  const activePageId = multiPageNavigation._getPosition(field.id);

  const resolvedActivePageId = resolveActivePageId(pages, visiblePages, activePageId);

  const activeIndex = visiblePages.findIndex((page) => page.id === resolvedActivePageId);
  const activePage = activeIndex === -1 ? null : visiblePages[activeIndex];

  const { data } = useService('form')._getState();
  const { isPageValid, reportPageErrors } = usePageValidation();

  // user actions go through the service, so that a host may veto them;
  // a read-only form can be paged through, but its fields cannot be corrected,
  // so moving on neither reports errors nor waits for them to be fixed
  const onNext = useCallback(
    () => multiPageNavigation.next(field.id, { validate: !readonly }),
    [field.id, multiPageNavigation, readonly],
  );

  const onBack = useCallback(() => multiPageNavigation.back(field.id), [field.id, multiPageNavigation]);

  // commit the page the container opens on, and any move a condition forced, so
  // that revealing an earlier page later does not drag the user backwards
  useEffect(() => {
    // a navigation between this render and its effects wins over what the render
    // resolved, and its event fired before the subscription above was in place
    if (multiPageNavigation._getPosition(field.id) !== activePageId) {
      rerender();
      return;
    }

    if (resolvedActivePageId === null || resolvedActivePageId === activePageId) {
      return;
    }

    const from = pages.find((page) => page.id === activePageId) || null;
    const to = visiblePages.find((page) => page.id === resolvedActivePageId);

    multiPageNavigation._setPosition(field, from, to);
  }, [activePageId, field, multiPageNavigation, pages, resolvedActivePageId, visiblePages]);

  // a failing field on a page that is not on screen is invisible to the user,
  // so bring the first such page forward when submission is rejected
  useEffect(() => {
    const onSubmit = ({ errors }) => {
      const failing = visiblePages.find((page) => hasErrors(page, errors));

      if (failing && failing.id !== resolvedActivePageId) {
        multiPageNavigation.navigate(field.id, failing.id);
      }
    };

    eventBus.on('submit', onSubmit);

    return () => eventBus.off('submit', onSubmit);
  }, [eventBus, field.id, multiPageNavigation, resolvedActivePageId, visiblePages]);

  const [isActivePageValid, setActivePageValid] = useState(true);

  // the pages register their field instances while rendering, so the registry is
  // only complete once every descendant is done; read it after the fact
  useLayoutEffect(() => {
    if (disableInvalidNavigation) {
      setActivePageValid(isPageValid(activePage, data));
    }
  }, [activePage, data, isPageValid, disableInvalidNavigation]);

  const blocked = Boolean(disableInvalidNavigation) && !readonly && !isActivePageValid;

  const onBlocked = useCallback(() => reportPageErrors(activePage), [activePage, reportPageErrors]);

  // the resolution runs a render ahead of the state it is committed to, so this
  // holds only while a condition is moving the user, and is false while the
  // container settles on the page the form opens with
  const focusOnMount = activePageId !== null && resolvedActivePageId !== activePageId;

  const multiPageContext = useMemo(
    () => ({ activePageId: resolvedActivePageId, showAllPages: false, focusOnMount }),
    [resolvedActivePageId, focusOnMount],
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
        <Children class="fjs-vertical-layout fjs-children cds--grid cds--grid--condensed" field={field}>
          {visiblePages.map((page) => (
            <div
              key={page.id}
              class="fjs-layout-row cds--row"
              style={{ display: page.id === resolvedActivePageId ? null : 'none' }}>
              <FormField {...props} field={page} indexes={indexes} />
            </div>
          ))}
        </Children>
      </MultiPageContext.Provider>
      <Navigation
        page={activePage}
        showBack={activeIndex > 0}
        showNext={activeIndex < visiblePages.length - 1}
        showSubmit={showSubmit && activeIndex === visiblePages.length - 1}
        blocked={blocked}
        onBack={onBack}
        onNext={onNext}
        onBlocked={onBlocked}
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
  create: (options = {}) => ({
    components: [],
    ...options,
  }),
};

function Navigation(props) {
  const { page, showBack, showNext, showSubmit, blocked, onBack, onNext, onBlocked, readonly, disabled } = props;

  const translate = useService('translate');

  const backLabel = useSingleLineTemplateEvaluation((page && page.backLabel) || translate('Back'), { debug: true });
  const nextLabel = useSingleLineTemplateEvaluation((page && page.nextLabel) || translate('Next'), { debug: true });
  const submitLabel = useSingleLineTemplateEvaluation((page && page.submitLabel) || translate('Submit'), {
    debug: true,
  });

  // a blocked control stays focusable and clickable on purpose, so that a user who
  // cannot move on is told why instead of finding a control that does nothing
  const onSubmitClick = useCallback(
    (event) => {
      if (blocked) {
        event.preventDefault();
        onBlocked();
      }
    },
    [blocked, onBlocked],
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
        <button
          type="button"
          class="fjs-button fjs-multipage-next"
          disabled={disabled}
          aria-disabled={blocked ? 'true' : null}
          onClick={onNext}>
          {nextLabel}
        </button>
      ) : null}
      {showSubmit ? (
        <button
          type="submit"
          class="fjs-button fjs-multipage-submit"
          disabled={disabled || readonly}
          aria-disabled={blocked ? 'true' : null}
          onClick={onSubmitClick}>
          {submitLabel}
        </button>
      ) : null}
    </div>
  );
}

/**
 * Resolve the pages of a multipage container that are not hidden by condition.
 *
 * The verdict comes from the condition checker, so that a page is on screen
 * exactly when its fields take part in the data.
 */
function useVisiblePages(pages, applyVisibilityConditions) {
  const conditionChecker = useService('conditionChecker', false);
  const { data } = useService('form')._getState();

  return useMemo(() => {
    if (!applyVisibilityConditions || !conditionChecker) {
      return pages;
    }

    const hiddenFieldIds = conditionChecker.getHiddenFieldIds(data);

    return pages.filter((page) => !hiddenFieldIds.has(page.id));
  }, [pages, applyVisibilityConditions, conditionChecker, data]);
}

/**
 * Validate only the fields belonging to a single page, so that moving forward
 * does not report errors on pages the user has not reached.
 *
 * `isPageValid` has no side effects and is safe to call while rendering.
 * `reportPageErrors` goes through the command stack and belongs on a click,
 * where it also reads the freshest data rather than the data of a render.
 */
function usePageValidation() {
  const multiPageNavigation = useService('multiPageNavigation');

  const isPageValid = useCallback(
    (page, data) => multiPageNavigation._isPageValid(page, data),
    [multiPageNavigation],
  );

  const reportPageErrors = useCallback((page) => multiPageNavigation._reportPageErrors(page), [multiPageNavigation]);

  return { isPageValid, reportPageErrors };
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
