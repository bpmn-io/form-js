import { useCallback } from 'preact/hooks';
import { useService, useTemplateEvaluation } from '../../hooks';
import { RawHTMLRenderer } from './parts/RawHTMLRenderer';
import { escapeHTML } from '../util/sanitizerUtil';

import {
  formFieldClasses
} from '../Util';

const type = 'html';

export function Html(props) {

  const form = useService('form');
  const { textLinkTarget } = form._getState().properties;

  const { field, disableLinks, domId } = props;

  const { content = '', strict = false } = field;

  const styleScopeId = `${domId}-style-scope`;

  // we escape HTML within the template evaluation to prevent clickjacking attacks
  const html = useTemplateEvaluation(content, { debug: true, strict, sanitizer: escapeHTML });

  const transform = useCallback((html) => {

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // (1) apply modifications to links

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

    // (2) scope styles to the root div

    const styleTags = tempDiv.querySelectorAll('style');

    styleTags.forEach(styleTag => {
      const scopedCss = styleTag.textContent
        .split('}')
        .map(rule => {
          if (!rule.trim()) return '';
          const [ selector, styles ] = rule.split('{');
          const scopedSelector = selector
            .split(',')
            .map(sel => `#${styleScopeId} ${sel.trim()}`)
            .join(', ');
          return `${scopedSelector} { ${styles}`;
        })
        .join('}');

      styleTag.textContent = scopedCss;
    });

    return tempDiv.innerHTML;

  }, [ disableLinks, styleScopeId, textLinkTarget ]);

  return <div id={ styleScopeId } class={ formFieldClasses(type) }>
    <RawHTMLRenderer html={ html } transform={ transform } sanitize={ true } sanitizeStyleTags={ false } />
  </div>;
}

Html.config = {
  type,
  keyed: false,
  label: 'HTML',
  group: 'presentation',
  create: (options = {}) => ({
    content: '',
    ...options
  })
};
