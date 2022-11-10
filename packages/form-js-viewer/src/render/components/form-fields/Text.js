import Markup from 'preact-markup';
import { useText } from '../../hooks/useText';

import {
  formFieldClasses,
  safeMarkdown
} from '../Util';

const type = 'text';


export default function Text(props) {
  const { field } = props;
  const text = useText(field);

  return <div class={ formFieldClasses(type) }>
    <Markup markup={ safeMarkdown(text) } trim={ false } />
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