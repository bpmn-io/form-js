import Markup from 'preact-markup';
import { useMemo } from 'preact/hooks';
import { useService, useTemplateEvaluation } from '../../hooks';
import { sanitizeHTML } from '../Sanitizer';

import {
  formFieldClasses
} from '../Util';

const type = 'text';


export default function Text(props) {
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

  const componentOverrides = useMemo(() => disableLinks ? { 'a': DisabledLink } : {}, [ disableLinks ]);

  return <div class={ formFieldClasses(type) }>
    <Markup markup={ safeHtml } components={ componentOverrides } trim={ false } />
  </div>;
}

Text.create = (options = {}) => ({
  text: '# Text',
  ...options
});

Text.type = type;
Text.keyed = false;
Text.group = 'presentation';
Text.label = 'Text view';

function DisabledLink({ href, children }) { return <a class="fjs-disabled-link" href={ href } tabIndex={ -1 }>{ children }</a>; }
