import { useCallback, useMemo } from 'preact/hooks';
import { useService, useTemplateEvaluation } from '../../hooks';
import { sanitizeHTML } from '../Sanitizer';
import { RawHTMLRenderer } from './parts/RawHTMLRenderer';

import {
  formFieldClasses
} from '../Util';

const type = 'text';

export function Text(props) {

  const form = useService('form');
  const { textLinkTarget } = form._getState().properties;

  const { field, disableLinks } = props;

  const { text = '', strict = false } = field;

  const markdownRenderer = useService('markdownRenderer');

  // feelers => pure markdown
  const markdown = useTemplateEvaluation(text, { debug: true, strict });

  // markdown => html
  const html = useMemo(() => markdownRenderer.render(markdown), [ markdownRenderer, markdown ]);

  const sanitizeAndTransformLinks = useCallback((unsafeHtml) => {

    const html = sanitizeHTML(unsafeHtml);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const links = tempDiv.querySelectorAll('a');

    links.forEach(link => {

      if (disableLinks) {
        link.setAttribute('class', 'fjs-disabled-link');
        link.setAttribute('tabIndex', '-1');
      }

      if (textLinkTarget) {
        link.setAttribute('target', textLinkTarget);
      }

    });

    return tempDiv.innerHTML;

  }, [ disableLinks, textLinkTarget ]);

  return <div class={ formFieldClasses(type) }>
    <RawHTMLRenderer html={ html } transform={ sanitizeAndTransformLinks } sanitize={ false } sanitizeStyleTags={ false } />
  </div>;
}

Text.config = {
  type,
  keyed: false,
  label: 'Text view',
  group: 'presentation',
  create: (options = {}) => ({
    text: '# Text',
    ...options
  })
};
