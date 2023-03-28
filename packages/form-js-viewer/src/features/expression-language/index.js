import FeelExpressionLanguage from './FeelExpressionLanguage';
import FeelersTemplating from './FeelersTemplating';
import ConditionChecker from './ConditionChecker';

export default {
  __init__: [ 'expressionLanguage', 'templating', 'conditionChecker' ],
  expressionLanguage: [ 'type', FeelExpressionLanguage ],
  templating: [ 'type', FeelersTemplating ],
  conditionChecker: [ 'type', ConditionChecker ]
};

export { FeelExpressionLanguage, FeelersTemplating, ConditionChecker };