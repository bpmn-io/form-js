import Markup from 'preact-markup';

import {
  formFieldClasses,
  safeMarkdown
} from '../Util';

import { generateIdForType } from '../../../util';

const type = 'text';

export default function Text(props) {
  const { field } = props;

  const { text } = field;

  return <div class={ formFieldClasses(type) }>
    <Markup markup={ safeMarkdown(text) } trim={ false } />
  </div>;
}

Text.create = function(options = {}) {
  const id = generateIdForType(type);

  return {
    id,
    text: '# Text',
    type,
    ...options
  };
};

Text.type = type;