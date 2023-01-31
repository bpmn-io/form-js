import Markup from 'preact-markup';

import { useExpressionValue } from '../../hooks/useExpressionValue';

import {
  formFieldClasses,
  safeMarkdown
} from '../Util';

const type = 'text';


export default function Text(props) {
  const { field, disableLinks } = props;

  const { text = '' } = field;

  const textValue = useExpressionValue(text) || '';

  const componentOverrides = disableLinks ? { 'a': DisabledLink } : {};

  return <div class={ formFieldClasses(type) }>
    <Markup markup={ safeMarkdown(textValue) } components={ componentOverrides } trim={ false } />
  </div>;
}

Text.create = function(options = {}) {
  return {
    text: '# Text',
    ...options
  };
};

Text.type = type;
Text.keyed = false;

function DisabledLink({ href, children }) { return <a class="fjs-disabled-link" href={ href } tabIndex={ -1 }>{ children }</a>; }
