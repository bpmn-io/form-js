import Markup from 'preact-markup';

import { safeMarkdown } from './Util';

import {
  generateIdForType
} from '../../util';

import { formFieldClasses } from './Util';

const type = 'text';

export default function TextRenderer(props) {
  const { field } = props;

  const { text } = field;

  return <div class={ formFieldClasses(type) }>
    <Markup markup={ safeMarkdown(text) } />
  </div>;
}

TextRenderer.create = function(options = {}) {
  const id = generateIdForType(type);

  return {
    id,
    text: '# Text',
    type,
    ...options
  };
};

TextRenderer.type = type;