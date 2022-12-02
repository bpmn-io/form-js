import Markup from 'preact-markup';

import { isExpression } from '../../../util/feel';

import { useExpressionValue } from '../../hooks/useExpressionValue';

import { iconsByType } from '../icons';

import {
  formFieldClasses,
  safeMarkdown
} from '../Util';

const type = 'text';


export default function Text(props) {
  const { field, disabled } = props;

  const { text = '' } = field;

  const textValue = useExpressionValue(text) || '';

  return <div class={ formFieldClasses(type) }>
    { renderText(field, textValue, disabled) }
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


// helper //////////////

function renderText(field, content, disabled) {
  const { text } = field;

  const Icon = iconsByType[ 'text' ];

  if (disabled) {
    if (!text) {
      return <div class="fjs-form-field-placeholder"><Icon viewBox="0 0 54 54" />Text view is empty</div>;
    }

    if (isExpression(text)) {
      return <div class="fjs-form-field-placeholder"><Icon viewBox="0 0 54 54" />Text view is populated by an expression</div>;
    }
  }

  return <Markup markup={ safeMarkdown(content) } trim={ false } />;
}