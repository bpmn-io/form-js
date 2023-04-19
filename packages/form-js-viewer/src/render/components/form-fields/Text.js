import Markup from 'preact-markup';
import { useMemo } from 'preact/hooks';
import { useService, useTemplateEvaluation } from '../../hooks';
import { sanitizeHTML } from '../Sanitizer';

import {
  formFieldClasses
} from '../Util';

const type = 'text';


export default function Text(props) {

  const form = useService('form');
  const { textLinkTarget } = form._getState().properties;

  const { field, disableLinks } = props;

  const { text = '', strict = false } = field;

  const markdownRenderer = useService('markdownRenderer');

  // feelers => pure markdown
  const markdown = useTemplateEvaluation(text, { debug: true, strict });

  // markdown => safe HTML
  const safeHtml = useMemo(() => {
    const html = markdownRenderer.render(markdown);
    return sanitizeHTML(html);
  }, [ markdownRenderer, markdown ]);

  const OverridenTargetLink = useMemo(() => BuildOverridenTargetLink(textLinkTarget), [ textLinkTarget ]);

  const componentOverrides = useMemo(() => {

    if (disableLinks) {
      return { 'a': DisabledLink };
    }

    if (textLinkTarget) {
      return { 'a': OverridenTargetLink };
    }

    return {};
  }, [ disableLinks, OverridenTargetLink, textLinkTarget ]);

  return <div class={ formFieldClasses(type) }>
    <Markup markup={ safeHtml } components={ componentOverrides } trim={ false } />
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

function BuildOverridenTargetLink(target) {
  return function({ children, ...rest }) {
    return <a { ...rest } target={ target }>{ children }</a>;
  };
}

function DisabledLink({ children, ...rest }) { return <a { ...rest } class="fjs-disabled-link" tabIndex={ -1 }>{ children }</a>; }
