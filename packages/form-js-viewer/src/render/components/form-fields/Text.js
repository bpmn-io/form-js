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
  const { useTargetBlank } = form._getState().properties;

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


  const componentOverrides = useMemo(() => {

    if (disableLinks) {
      return { 'a': DisabledLink };
    }

    if (useTargetBlank) {
      return { 'a': TargetBlankLink };
    }

    return {};
  }, [ disableLinks, useTargetBlank ]);

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

function DisabledLink({ children, ...rest }) { return <a { ...rest } class="fjs-disabled-link" tabIndex={ -1 }>{ children }</a>; }

function TargetBlankLink({ children, ...rest }) { return <a { ...rest } target={ '_blank' }>{ children }</a>; }
