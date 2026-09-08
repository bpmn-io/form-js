import { get } from 'min-dash';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

import { FormRenderContext, LocalExpressionContext, MultiPageContext } from '../../context';
import { useService, useSingleLineTemplateEvaluation } from '../../hooks';
import { runUnaryTestEvaluation } from '../../../util/expressions';
import { formFieldClasses } from '../Util';
import { FormField } from '../FormField';

const type = 'multipage';

export function MultiPage(props) {
  const { field, indexes, readonly, disabled } = props;

  const { Children, applyVisibilityConditions } = useContext(FormRenderContext);

  const { components, showSubmit } = field;
  const pages = useMemo(() => components || [], [components]);

  const visiblePages = useVisiblePages(pages, applyVisibilityConditions);

  const [activePageId, setActivePageId] = useState(null);

  // a condition may hide the page the user is on; carry on from where it stood
  // rather than dropping back to the beginning
  const resolvedActivePageId = useMemo(() => {
    if (!visiblePages.length) {
      return null;
    }

    if (visiblePages.some((page) => page.id === activePageId)) {
      return activePageId;
    }

    const position = pages.findIndex((page) => page.id === activePageId);

    if (position === -1) {
      return visiblePages[0].id;
    }

    const forward = visiblePages.find((page) => pages.indexOf(page) > position);

    return (forward || visiblePages[visiblePages.length - 1]).id;
  }, [pages, visiblePages, activePageId]);

  const activeIndex = visiblePages.findIndex((page) => page.id === resolvedActivePageId);
  const activePage = activeIndex === -1 ? null : visiblePages[activeIndex];

  const eventBus = useService('eventBus');
  const validatePage = usePageValidation(indexes);

  const navigate = useCallback(
    (target) => {
      if (!target) {
        return;
      }

      setActivePageId(target.id);

      eventBus.fire('multipage.pageChanged', {
        formField: field,
        from: activePage,
        to: target,
        indexes,
      });
    },
    [activePage, eventBus, field, indexes],
  );

  const onNext = useCallback(() => {
    if (!validatePage(activePage)) {
      return;
    }

    navigate(visiblePages[activeIndex + 1]);
  }, [activeIndex, activePage, navigate, validatePage, visiblePages]);

  const onBack = useCallback(() => navigate(visiblePages[activeIndex - 1]), [activeIndex, navigate, visiblePages]);

  // a failing field on a page that is not on screen is invisible to the user,
  // so bring the first such page forward when submission is rejected
  useEffect(() => {
    const onSubmit = ({ errors }) => {
      const failing = visiblePages.find((page) => hasErrors(page, errors, indexes));

      if (failing && failing.id !== resolvedActivePageId) {
        navigate(failing);
      }
    };

    eventBus.on('submit', onSubmit);

    return () => eventBus.off('submit', onSubmit);
  }, [eventBus, indexes, navigate, resolvedActivePageId, visiblePages]);

  const multiPageContext = useMemo(
    () => ({ activePageId: resolvedActivePageId, showAllPages: false }),
    [resolvedActivePageId],
  );

  if (!visiblePages.length) {
    return null;
  }

  return (
    <div className={formFieldClasses(type)}>
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
  create: (options = {}) => ({
    components: [],
    ...options,
  }),
};

function Navigation(props) {
  const { page, showBack, showNext, showSubmit, onBack, onNext, readonly, disabled } = props;

  const backLabel = useSingleLineTemplateEvaluation((page && page.backLabel) || 'Back', { debug: true });
  const nextLabel = useSingleLineTemplateEvaluation((page && page.nextLabel) || 'Next', { debug: true });
  const submitLabel = useSingleLineTemplateEvaluation((page && page.submitLabel) || 'Submit', { debug: true });

  if (!showBack && !showNext && !showSubmit) {
    return null;
  }

  return (
    <div class="fjs-multipage-navigation">
      {showBack ? (
        <button type="button" class="fjs-button fjs-multipage-back" disabled={disabled || readonly} onClick={onBack}>
          {backLabel}
        </button>
      ) : null}
      {showNext ? (
        <button type="button" class="fjs-button fjs-multipage-next" disabled={disabled || readonly} onClick={onNext}>
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

/**
 * Resolve the pages of a multipage container that are not hidden by condition.
 *
 * Evaluated here rather than read back from the condition checker so that the
 * container knows what "next" means before its pages render.
 */
function useVisiblePages(pages, applyVisibilityConditions) {
  const expressionLanguage = useService('expressionLanguage');
  const expressionContextInfo = useContext(LocalExpressionContext);

  return useMemo(() => {
    if (!applyVisibilityConditions) {
      return pages;
    }

    return pages.filter((page) => {
      const hideExpression = page.conditional && page.conditional.hide;

      if (!hideExpression) {
        return true;
      }

      return !runUnaryTestEvaluation(expressionLanguage, hideExpression, expressionContextInfo);
    });
  }, [pages, applyVisibilityConditions, expressionLanguage, expressionContextInfo]);
}

/**
 * Validate only the fields belonging to a single page, so that moving forward
 * does not report errors on pages the user has not reached.
 */
function usePageValidation(indexes) {
  const form = useService('form');
  const validator = useService('validator');
  const formFieldRegistry = useService('formFieldRegistry');
  const formFieldInstanceRegistry = useService('formFieldInstanceRegistry', false);
  const viewerCommands = useService('viewerCommands', false);

  return useCallback(
    (page) => {
      if (!page || !formFieldInstanceRegistry || !viewerCommands) {
        return true;
      }

      const pageFieldIds = collectFieldIds(page);
      const { data } = form._getState();

      let isValid = true;

      formFieldInstanceRegistry
        .getAllKeyed()
        .filter(({ id, indexes: instanceIndexes }) => {
          if (!pageFieldIds.has(id)) {
            return false;
          }

          // a multipage container may itself sit within a repetition
          return Object.entries(indexes || {}).every(([key, index]) => (instanceIndexes || {})[key] === index);
        })
        .forEach((fieldInstance) => {
          const field = formFieldRegistry.get(fieldInstance.id);

          if (field && field.disabled) {
            return;
          }

          const value = get(data, fieldInstance.valuePath);

          if (validator.validateFieldInstance(fieldInstance, value).length) {
            isValid = false;
          }

          viewerCommands.updateFieldInstanceValidation(fieldInstance, value);
        });

      return isValid;
    },
    [form, formFieldInstanceRegistry, formFieldRegistry, indexes, validator, viewerCommands],
  );
}

function collectFieldIds(field, ids = new Set()) {
  (field.components || []).forEach((component) => {
    ids.add(component.id);
    collectFieldIds(component, ids);
  });

  return ids;
}

function hasErrors(page, errors, indexes) {
  const scope = Object.values(indexes || {});

  return Array.from(collectFieldIds(page)).some((id) => get(errors, [id, ...scope]));
}
