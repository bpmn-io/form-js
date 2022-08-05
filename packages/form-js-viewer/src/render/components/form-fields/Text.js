import Markup from 'preact-markup';

import {
  formFieldClasses,
  safeTemplateMarkdown
} from '../Util';

const type = 'text';


export default function Text(props) {
  const { field,value } = props;

  const { text = '' } = field;

  return <div class={ formFieldClasses(type) }>
    <Markup markup={ safeTemplateMarkdown(text,value) } trim={ false } />
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