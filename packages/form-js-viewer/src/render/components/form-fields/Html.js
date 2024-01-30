import { useCallback } from 'preact/hooks';
import { useService, useTemplateEvaluation, useDangerousHTMLWrapper } from '../../hooks';
import { escapeHTML } from '../util/sanitizerUtil';
import { wrapCSSStyles } from '../util/domUtil';

import {
  formFieldClasses
} from '../Util';
import classNames from 'classnames';

const type = 'html';

export function Html(props) {

  const form = useService('form');
  const { textLinkTarget } = form._getState().properties;

  const { field, disableLinks, domId } = props;

  const { content = '', strict = false } = field;

  const styleScope = `${domId}-style-scope`;

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
    wrapCSSStyles(tempDiv, `.${styleScope}`);

    return tempDiv.innerHTML;

  }, [ disableLinks, styleScope, textLinkTarget ]);

  const dangerouslySetInnerHTML = useDangerousHTMLWrapper({
    html,
    transform,
    sanitize: true,
    sanitizeStyleTags: false
  });

  return <div class={ classNames(formFieldClasses(type), styleScope) } dangerouslySetInnerHTML={ dangerouslySetInnerHTML }></div>;
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
