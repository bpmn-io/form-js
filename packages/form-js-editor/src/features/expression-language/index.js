import { FeelExpressionLanguage, FeelersTemplating } from '@bpmn-io/form-js-viewer';

export default {
  __init__: [ 'expressionLanguage', 'templating' ],
  expressionLanguage: [ 'type', FeelExpressionLanguage ],
  templating: [ 'type', FeelersTemplating ]
};
