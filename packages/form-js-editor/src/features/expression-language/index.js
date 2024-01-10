import { FeelExpressionLanguage } from '@bpmn-io/form-js-viewer';
import { EditorTemplating } from './EditorTemplating';

export const EditorExpressionLanguageModule = {
  __init__: [ 'expressionLanguage', 'templating' ],
  expressionLanguage: [ 'type', FeelExpressionLanguage ],
  templating: [ 'type', EditorTemplating ]
};
