import { useCallback } from 'preact/hooks';
import { useService, useTemplateEvaluation } from '../../hooks';
import { RawHTMLRenderer } from './parts/RawHTMLRenderer';

import {
  formFieldClasses
} from '../Util';

const type = 'html';

export function Html(props) {

  const form = useService('form');
  const { textLinkTarget } = form._getState().properties;

  const { field, disableLinks } = props;

  const { content = '', strict = false } = field;

  const html = useTemplateEvaluation(content, { debug: true, strict });

  const transformLinks = useCallback((html) => {

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
    <RawHTMLRenderer html={ html } transform={ transformLinks } sanitize={ true } sanitizeStyleTags={ true } />
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
